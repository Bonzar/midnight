import type { RequestHandler } from "express";
import { ApiError } from "../error/ApiError";
import { ProductImage } from "../models/ProductImage";
import { parseInt } from "../../helpers/parseInt";
import { v4 as uuidV4 } from "uuid";
import path from "path";

class ProductImageController {
  create: RequestHandler<
    void,
    ProductImage | ProductImage[],
    { productId: string; sort: string }
  > = async (req, res, next) => {
    try {
      const reqProductId = parseInt(req.body.productId);
      console.log({ reqProductId });
      const reqSort = parseInt(req.body.sort);

      const files = req.files;
      const img = files?.url;
      if (!img) {
        return next(
          ApiError.badRequest(
            "Ошибка при сохранение изображение. Изображение не было получено"
          )
        );
      }

      const PATH_TO_PRODUCT_IMAGES = "../../../static/productImages/";

      const getImageModelObjectToSave = (sort: number) => {
        const imgFilename = uuidV4() + ".jpg";
        return {
          productId: reqProductId,
          url: imgFilename,
          sort,
        };
      };

      if (img instanceof Array) {
        const imageModelObjects = img.map((imgElement, index) =>
          getImageModelObjectToSave(reqSort + index)
        );

        // Saving to DB
        const newProductImages = await ProductImage.bulkCreate(
          imageModelObjects
        );

        // If success save in DB -> move to static
        img.forEach((imgElement, index) =>
          imgElement.mv(
            path.resolve(
              __dirname,
              PATH_TO_PRODUCT_IMAGES + imageModelObjects[index].url
            )
          )
        );

        return res.json(newProductImages);
      }

      // img is only one Image
      const imageModelObjects = getImageModelObjectToSave(reqSort);

      // Saving to DB
      const newProductImage = await ProductImage.create(imageModelObjects);

      // If success save in DB -> move to static
      img.mv(
        path.resolve(__dirname, PATH_TO_PRODUCT_IMAGES + imageModelObjects.url)
      );

      return res.json(newProductImage);
    } catch (error) {
      next(
        ApiError.badRequest("Ошибка сохранения изображения продукта", error)
      );
    }
  };

  // get: RequestHandler<{ id: string }, ProductImage> = async (
  //   req,
  //   res,
  //   next
  // ) => {
  //   try {
  //     const productId = parseInt(req.params.id);
  //
  //     const product = await ProductImage.findOne({
  //       where: { id: productId },
  //       include: [ProductImageMeta, ProductImageImage],
  //     });
  //     if (!product) {
  //       return next(
  //         ApiError.badRequest(`Продукт с id - ${productId} не найден`)
  //       );
  //     }
  //
  //     return res.json(product);
  //   } catch (error) {
  //     next(ApiError.badRequest("Ошибка получения Продукта", error));
  //   }
  // };
  //
  // update: RequestHandler<
  //   { id: string },
  //   ProductImage,
  //   Partial<IProductImageCreationAttributes>
  // > = async (req, res, next) => {
  //   try {
  //     const productId = parseInt(req.params.id);
  //
  //     const product = await ProductImage.findOne({ where: { id: productId } });
  //     if (!product) {
  //       return next(
  //         ApiError.badRequest(`Продукт с id - ${productId} не найден`)
  //       );
  //     }
  //
  //     const updatedProductImage = await product.update({
  //       name: req.body.name,
  //       price: req.body.price,
  //       stock: req.body.stock,
  //       description: req.body.description,
  //       discount: req.body.discount,
  //       categoryId: req.body.categoryId,
  //     });
  //
  //     return res.json(updatedProductImage);
  //   } catch (error) {
  //     next(ApiError.badRequest("Ошибка обновления Продукта", error));
  //   }
  // };
  //
  // delete: RequestHandler<{ id: string }, ProductImage> = async (
  //   req,
  //   res,
  //   next
  // ) => {
  //   try {
  //     const productId = parseInt(req.params.id);
  //
  //     const product = await ProductImage.findOne({ where: { id: productId } });
  //     if (!product) {
  //       return next(
  //         ApiError.badRequest(`Продукт с id - ${productId} не найден`)
  //       );
  //     }
  //
  //     await product.destroy({ benchmark: true });
  //
  //     res.status(200).json(product);
  //   } catch (error) {
  //     next(ApiError.badRequest("Ошибка удаления Продукта", error));
  //   }
  // };
}

export const productImageController = new ProductImageController();
