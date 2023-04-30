import type { RequestHandler } from "express";
import { ApiError } from "../error/ApiError";
import type { IProductImageCreationAttributes } from "../models/ProductImage";
import { ProductImage } from "../models/ProductImage";
import { parseInt } from "../../helpers/parseInt";
import { v4 as uuidV4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import { sequelize } from "../database";

const PATH_TO_PRODUCT_IMAGES =
  path.resolve(__dirname, "../../../static/productImages") + "/";

// Form data always string
interface CreateProductImageBody {
  productId?: number; // number
  sort?: number; // number
  description: string[]; //JSON.stringify string[]
}

type AsFormData<T> = {
  [N in keyof T]: string;
};

type UpdateProductImageBody = Partial<IProductImageCreationAttributes>;

type UpdateManyProductImageBody = (Partial<IProductImageCreationAttributes> & {
  id: number;
})[];

class ProductImageController {
  create: RequestHandler<
    void,
    ProductImage | ProductImage[],
    AsFormData<CreateProductImageBody>,
    void
  > = async (req, res, next) => {
    try {
      const productId = req.body.productId
        ? parseInt(req.body.productId)
        : null;
      const reqSortIndex = req.body.sort ? parseInt(req.body.sort) : null;

      let sortIndex = 0;
      if (reqSortIndex) {
        sortIndex = reqSortIndex;
      }
      // Set sortIndex as max + 1 sort field of specific Product
      // or 0 if product hasn't images
      if (!reqSortIndex && productId) {
        const maxProductSortIndex = await ProductImage.max<
          ProductImage["sort"] | null,
          ProductImage
        >("sort", {
          where: { productId },
        });

        sortIndex =
          typeof maxProductSortIndex === "number" ? maxProductSortIndex + 1 : 0;
      }

      // Parsing reqDescription field to string[]
      let reqDescription: string[] = [];
      try {
        const parsedDescription = JSON.parse(req.body.description);
        if (
          !(parsedDescription instanceof Array) ||
          typeof parsedDescription[0] !== "string"
        ) {
          return next(
            ApiError.badRequest(
              "Неверный формат переданных описаний для изображений"
            )
          );
        }
        reqDescription = parsedDescription as string[];
      } catch (error) {
        if (error instanceof SyntaxError) {
          return next(
            ApiError.badRequest(
              "Ошибка в формате переданных описаний для изображений"
            )
          );
        }

        return next(
          ApiError.badRequest(
            "Ошибка при обработке описаний для изображений",
            error
          )
        );
      }

      const files = req.files;
      const img = files?.url;
      if (!img) {
        return next(ApiError.badRequest("Изображение не было получено"));
      }

      /**
       * @description Make ProductImage object for saving in DB
       */
      const getImageModelObjectToSave = (sort: number, description: string) => {
        const imgFilename = uuidV4() + ".jpg";
        return {
          productId,
          url: imgFilename,
          description,
          sort,
        };
      };

      const imagesLength = img instanceof Array ? img.length : 1;
      const descriptionsLength = reqDescription.length;
      if (imagesLength !== descriptionsLength) {
        return next(
          ApiError.badRequest(
            `Количество изображений (${imagesLength}) не соответствует количеству преданных описаний (${descriptionsLength})`
          )
        );
      }

      /*
       Process img as Array of images
      */
      if (img instanceof Array) {
        const imageModelObjects = img.map((imgElement, index) => {
          // increase sort index if productId was provided
          const currentSortIndex = productId ? sortIndex + index : sortIndex;

          return getImageModelObjectToSave(
            currentSortIndex,
            reqDescription[index]
          );
        });

        const newProductImages = await sequelize.transaction(
          async (transaction) => {
            // Saving to DB
            const newProductImages = await ProductImage.bulkCreate(
              imageModelObjects,
              { transaction }
            );

            // If success save in DB -> move to static folder
            img.forEach((imgElement, index) =>
              imgElement.mv(
                PATH_TO_PRODUCT_IMAGES + imageModelObjects[index].url
              )
            );

            return newProductImages;
          }
        );

        return res.json(newProductImages);
      }

      /*
       Now img is just a one Image
      */

      const imageModelObjects = getImageModelObjectToSave(
        sortIndex,
        reqDescription[0]
      );

      // Saving to DB
      const newProductImage = await sequelize.transaction(
        async (transaction) => {
          const newProductImage = await ProductImage.create(imageModelObjects, {
            transaction,
          });

          // If success save in DB -> move image to static folder
          await img.mv(PATH_TO_PRODUCT_IMAGES + imageModelObjects.url);

          return newProductImage;
        }
      );

      return res.json(newProductImage);
    } catch (error) {
      next(
        ApiError.badRequest("Ошибка сохранения изображения продукта", error)
      );
    }
  };

  update: RequestHandler<{ id: string }, ProductImage, UpdateProductImageBody> =
    async (req, res, next) => {
      try {
        const productImageId = parseInt(req.params.id);
        // prevent updating id and url
        const { id, url, ...updatingData } = req.body;

        const productImage = await ProductImage.findOne({
          where: { id: productImageId },
        });
        if (!productImage) {
          return next(
            ApiError.badRequest(
              `Изображение с id - ${productImageId} не найдено`
            )
          );
        }

        const updatedProductImage = await productImage.update({
          ...updatingData,
        });

        return res.json(updatedProductImage);
      } catch (error) {
        next(ApiError.badRequest("Ошибка обновления изображения", error));
      }
    };

  updateMany: RequestHandler<void, ProductImage[], UpdateManyProductImageBody> =
    async (req, res, next) => {
      try {
        const updateImagesData = req.body;

        if (!updateImagesData.map((imgObject) => imgObject.id).every(Boolean)) {
          next(
            ApiError.badRequest("Не предоставлен id изображения для обновления")
          );
        }

        const result = await sequelize.transaction(async (transaction) => {
          const productImages = await ProductImage.findAll({
            where: {
              id: updateImagesData.map((updateImage) => updateImage.id),
            },
            transaction,
          });

          // save productIds for restore it later
          const savedImageProductIds: {
            [id: number]: { productId: number };
          } = {};
          for (const productImage of productImages) {
            savedImageProductIds[productImage.id] = {
              productId: productImage.productId,
            };
          }

          // unlink all given images from products
          const resetPromises: Promise<ProductImage>[] = [];
          for (const productImage of productImages) {
            resetPromises.push(
              productImage.update({ productId: null }, { transaction })
            );
          }
          await Promise.all(resetPromises);

          const updatePromises = updateImagesData.map(async (updateImage) => {
            // prevent updating id and url
            const { id, url, ...updatingData } = updateImage;

            const productImage = productImages.find(
              (productImage) => productImage.id === updateImage.id
            );

            if (!productImage) {
              throw new Error(
                `Изображение с id - ${updateImage.id} не найдено`
              );
            }

            const prevImageProductId =
              savedImageProductIds[productImage.id].productId;

            return await productImage.update(
              // return back productId or override it from new data
              { productId: prevImageProductId, ...updatingData },
              { transaction }
            );
          });

          return Promise.all(updatePromises);
        });

        return res.json(result);
      } catch (error) {
        next(ApiError.badRequest("Ошибка обновления изображения", error));
      }
    };

  delete: RequestHandler<{ id: string }, void, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const productImageId = parseInt(req.params.id);

      await sequelize.transaction(async (transaction) => {
        const productImage = await ProductImage.findOne({
          where: { id: productImageId },
          transaction,
        });

        if (!productImage) {
          throw new Error(`Изображение с id - ${productImageId} не найдено`);
        }

        await productImage.destroy({ transaction });

        await fs.unlink(PATH_TO_PRODUCT_IMAGES + productImage.url);
      });

      res.status(200).end();
    } catch (error) {
      next(ApiError.badRequest("Ошибка удаления изображения продукта", error));
    }
  };
}

export const productImageController = new ProductImageController();
