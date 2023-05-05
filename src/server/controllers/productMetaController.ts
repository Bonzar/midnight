import type { ProductMeta } from "../models/ProductMeta";
import type { RequestHandler } from "express";
import type {
  UpdateProductMetaData,
  CreateProductMetaData,
} from "../services/productMetaService";
import { ApiError } from "../error/ApiError";
import { productMetaService } from "../services/productMetaService";
import { parseInt } from "../../helpers/parseInt";

export type CreateProductMetaBody = CreateProductMetaData;
export type UpdateProductMetaBody = UpdateProductMetaData;

class ProductMetaController {
  create: RequestHandler<void, ProductMeta, CreateProductMetaBody, void> =
    async (req, res, next) => {
      try {
        const productMeta = await productMetaService.create(req.body);

        res.status(200).json(productMeta);
      } catch (error) {
        next(
          ApiError.setDefaultMessage(
            "При создании товара произошла ошибка",
            error
          )
        );
      }
    };

  update: RequestHandler<
    { id: string },
    ProductMeta,
    UpdateProductMetaBody,
    void
  > = async (req, res, next) => {
    try {
      const updatedProductMeta = await productMetaService.update(
        parseInt(req.params.id),
        req.body
      );

      res.status(200).json(updatedProductMeta);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          `При обновлении характеристики товара с id - ${req.params.id} произошла ошибка`,
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
      await productMetaService.delete(parseInt(req.params.id));

      res.status(200).end();
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          `При удаления характеристики товара с id - ${req.params.id} произошла ошибка`,
          error
        )
      );
    }
  };
}

export const productMetaController = new ProductMetaController();
