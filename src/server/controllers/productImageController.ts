import type { RequestHandler } from "express";
import { ApiError } from "../error/ApiError";
import type { ProductImageAttributesWithAssociations } from "../models/ProductImage";
import { parseAppInt } from "../../helpers/parseAppInt";
import type {
  UpdateProductImageData,
  UpdateManyProductImageData,
} from "../services/productImageService";
import { productImageService } from "../services/productImageService";
import type { AllAsString } from "../../../types/types";

// Form data as string
// todo add `images` field  in type
export interface CreateProductImageFormDataBody {
  productId?: number;
  sort?: number;
  description: string[];
}
export type CreateProductImageResponse =
  ProductImageAttributesWithAssociations<never>[];

export type UpdateProductImageBody = UpdateProductImageData;
export type UpdateProductImageResponse =
  ProductImageAttributesWithAssociations<never>;

export type UpdateManyProductImageBody = UpdateManyProductImageData;
export type UpdateManyProductImageResponse =
  ProductImageAttributesWithAssociations<never>[];

class ProductImageController {
  create: RequestHandler<
    void,
    CreateProductImageResponse,
    AllAsString<CreateProductImageFormDataBody>,
    void
  > = async (req, res, next) => {
    try {
      const imageFiles = req.files?.images;
      if (!imageFiles) {
        return next(ApiError.badRequest("Изображение не было получено"));
      }

      const imagesArray =
        imageFiles instanceof Array ? imageFiles : [imageFiles];

      const productId = req.body.productId
        ? parseAppInt(req.body.productId)
        : undefined;

      const startSortIndex = req.body.sort
        ? parseAppInt(req.body.sort)
        : undefined;

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

      // Arrays length check
      if (imagesArray.length !== reqDescription.length) {
        return next(
          ApiError.badRequest(
            `Количество изображений (${imagesArray.length}) не соответствует количеству преданных описаний (${reqDescription.length})`
          )
        );
      }

      const imagesData = imagesArray.map((image, index) => ({
        file: image,
        description: reqDescription[index],
      }));

      const newProductImages = await productImageService.create(
        imagesData,
        productId,
        startSortIndex
      );

      return res.json(newProductImages);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При сохранении изображения произошла ошибка",
          error
        )
      );
    }
  };

  update: RequestHandler<
    { id: string },
    UpdateProductImageResponse,
    UpdateProductImageBody,
    void
  > = async (req, res, next) => {
    try {
      const productImageId = parseAppInt(req.params.id);

      const updatedProductImage = await productImageService.update(
        productImageId,
        req.body
      );

      return res.json(updatedProductImage);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          `При обновлении изображения с id - ${req.params.id} произошла ошибка`,
          error
        )
      );
    }
  };

  updateMany: RequestHandler<
    void,
    UpdateManyProductImageResponse,
    UpdateManyProductImageBody,
    void
  > = async (req, res, next) => {
    try {
      const updatedImages = await productImageService.updateMany(req.body);

      return res.json(updatedImages);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "Во время обновления изображений произошла ошибка",
          error
        )
      );
    }
  };

  delete: RequestHandler<{ id: string }, void, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const productImageId = parseAppInt(req.params.id);

      await productImageService.delete(productImageId);

      res.status(200).end();
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          `При удалении изображения с id - ${req.params.id} произошла ошибка`,
          error
        )
      );
    }
  };
}

export const productImageController = new ProductImageController();
