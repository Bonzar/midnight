import type { RequestHandler } from "express";
import { ApiError } from "../error/ApiError";
import type { Product } from "../models/Product";
import { parseAppInt } from "../../helpers/parseAppInt";
import type {
  CreateProductData,
  UpdateProductData,
} from "../services/productService";
import { productService } from "../services/productService";
import type { AllAsString } from "../../../types/types";

export type CreateProductBody = CreateProductData;

export type UpdateProductBody = UpdateProductData;

export type GetAllProductsResponse = { rows: Product[]; count: number };
export type GetAllProductsQuery = {
  categoryId?: number;
  limit?: number;
  page?: number;
};

class ProductController {
  create: RequestHandler<void, Product, CreateProductBody, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const newProduct = await productService.create(req.body);

      return res.json(newProduct);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При создании товара произошла ошибка",
          error
        )
      );
    }
  };

  get: RequestHandler<{ id: string }, Product, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const productId = parseAppInt(req.params.id);

      const product = await productService.getDetailed(productId);

      return res.json(product);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          `При получении товара с id - ${req.params.id} произошла ошибка`,
          error
        )
      );
    }
  };

  getAll: RequestHandler<
    void,
    GetAllProductsResponse,
    void,
    AllAsString<GetAllProductsQuery>
  > = async (req, res, next) => {
    try {
      let limit;
      if (req.query.limit) {
        limit = parseAppInt(req.query.limit);
      }

      let page;
      if (req.query.page) {
        page = parseAppInt(req.query.page);
      }

      let categoryId;
      if (req.query.categoryId) {
        categoryId = parseAppInt(req.query.categoryId);
      }

      const products = await productService.getAll(categoryId, limit, page);

      return res.json(products);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При получении всех товара произошла ошибка",
          error
        )
      );
    }
  };

  update: RequestHandler<{ id: string }, Product, UpdateProductBody, void> =
    async (req, res, next) => {
      try {
        const productId = parseAppInt(req.params.id);

        const updatedProduct = await productService.update(productId, req.body);

        return res.json(updatedProduct);
      } catch (error) {
        next(
          ApiError.setDefaultMessage(
            `При обновлении товара с id - ${req.params.id} произошла ошибка`,
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
      const productId = parseAppInt(req.params.id);

      await productService.delete(productId);

      res.status(200).end();
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          `При удалении товара с id - ${req.params.id} произошла ошибка`,
          error
        )
      );
    }
  };
}

export const productController = new ProductController();
