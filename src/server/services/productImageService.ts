import { sequelize } from "../database";
import type { ProductImageAttributes } from "../models/ProductImage";
import { ProductImage } from "../models/ProductImage";
import { v4 as uuidV4 } from "uuid";
import path from "path";
import type { UploadedFile } from "express-fileupload";
import fs from "fs/promises";
import { ApiError } from "../error/ApiError";

const PATH_TO_PRODUCT_IMAGES =
  path.resolve(__dirname, "../../../static/productImages") + "/";

export interface ProductImageData {
  file: UploadedFile;
  description: string;
}

export type UpdateProductImageData = Omit<
  Partial<ProductImageAttributes>,
  "url"
>;

export type UpdateManyProductImageData = (Omit<UpdateProductImageData, "id"> &
  Required<Pick<UpdateProductImageData, "id">>)[];

class ProductImageService {
  async create(
    images: ProductImageData[],
    productId?: number,
    startSortIndex?: number
  ) {
    let sortIndex = startSortIndex ?? 0;

    // Set sortIndex as max + 1 sort field of specific Product
    // or 0 if product hasn't images
    if (!startSortIndex && productId) {
      const maxProductSortIndex = await ProductImage.max<
        ProductImage["sort"] | null,
        ProductImage
      >("sort", {
        where: { productId },
      });

      sortIndex =
        typeof maxProductSortIndex === "number" ? maxProductSortIndex + 1 : 0;
    }

    if (images.length === 0) {
      throw ApiError.badRequest("Массив изображений пустой");
    }

    const getImageModelObjectToSave = (sort: number, description: string) => {
      const imgFilename = uuidV4() + ".jpg";
      return {
        productId,
        url: imgFilename,
        description,
        sort,
      };
    };

    const imageModelObjects = images.map((image, index) => {
      // increase sort index if productId was provided
      const currentSortIndex = productId ? sortIndex + index : sortIndex;

      return getImageModelObjectToSave(currentSortIndex, image.description);
    });

    return await sequelize.transaction(async () => {
      const newProductImages = await ProductImage.bulkCreate(imageModelObjects);

      // If success save in DB -> move to static folder
      images.forEach((image, index) =>
        image.file.mv(PATH_TO_PRODUCT_IMAGES + imageModelObjects[index].url)
      );

      return newProductImages;
    });
  }

  async getOne(id: number) {
    if (!id) {
      throw ApiError.badRequest(
        `Для получения изображения не был предоставлен ID`
      );
    }

    const productImage = await ProductImage.findOne({ where: { id } });

    if (!productImage) {
      throw ApiError.badRequest(`Изображение с id - ${id} не найдено`);
    }

    return productImage;
  }

  async update(id: number, data: UpdateProductImageData) {
    const productImage = await this.getOne(id);

    // prevent updating url
    if ("url" in data) {
      delete data.url;
    }

    return await productImage.update(data);
  }

  async updateMany(data: UpdateManyProductImageData) {
    if (!data || !(data.length >= 0)) {
      throw ApiError.badRequest(
        "Не верный формат данных для обновления изображений"
      );
    }

    if (!data.map((imgObject) => imgObject.id).every(Boolean)) {
      throw ApiError.badRequest(
        "Не для всех изображений предоставлен id для обновления"
      );
    }

    return await sequelize.transaction(async () => {
      const productImages = await ProductImage.findAll({
        where: {
          id: data.map((updateImage) => updateImage.id),
        },
      });

      // save productIds for restore it later
      const savedImageProductIds: {
        [id: number]: { productId: number | null };
      } = {};
      for (const productImage of productImages) {
        savedImageProductIds[productImage.id] = {
          productId: productImage.productId,
        };
      }

      // unlink all given images from products
      const resetPromises: Promise<ProductImage>[] = [];
      for (const productImage of productImages) {
        resetPromises.push(productImage.update({ productId: null }));
      }
      await Promise.all(resetPromises);

      const updatePromises = data.map(async (updateImage) => {
        // prevent updating url
        if ("url" in updateImage) {
          delete updateImage.url;
        }

        const productImage = productImages.find(
          (productImage) => productImage.id === updateImage.id
        );

        if (!productImage) {
          throw ApiError.badRequest(
            `Изображение с id - ${updateImage.id} не найдено`
          );
        }

        const prevImageProductId =
          savedImageProductIds[productImage.id].productId;

        return await productImage.update(
          // return back productId or override it from new data
          { productId: prevImageProductId, ...updateImage }
        );
      });

      return Promise.all(updatePromises);
    });
  }

  async delete(id: number) {
    return await sequelize.transaction(async () => {
      const productImage = await this.getOne(id);

      await productImage.destroy();

      await fs.unlink(PATH_TO_PRODUCT_IMAGES + productImage.url);
    });
  }
}

export const productImageService = new ProductImageService();
