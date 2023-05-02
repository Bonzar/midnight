import type { RequestHandler } from "express";
import { ApiError } from "../error/ApiError";
import type { Product } from "../models/Product";
import { parseInt } from "../../helpers/parseInt";
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
        ApiError.badRequest("При создании продукта произошла ошибка", error)
      );
    }
  };

  get: RequestHandler<{ id: string }, Product, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const productId = parseInt(req.params.id);

      const product = await productService.get(productId);

      return res.json(product);
    } catch (error) {
      next(
        ApiError.badRequest("При получении продукта произошла ошибка", error)
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
        limit = parseInt(req.query.limit);
      }

      let page;
      if (req.query.page) {
        page = parseInt(req.query.page);
      }

      let categoryId;
      if (req.query.categoryId) {
        categoryId = parseInt(req.query.categoryId);
      }

      const products = await productService.getAll(categoryId, limit, page);

      return res.json(products);
    } catch (error) {
      next(
        ApiError.badRequest(
          "При получении всех продуктов произошла ошибка",
          error
        )
      );
    }
  };

  update: RequestHandler<{ id: string }, Product, UpdateProductBody, void> =
    async (req, res, next) => {
      try {
        const productId = parseInt(req.params.id);

        const updatedProduct = await productService.update(productId, req.body);

        return res.json(updatedProduct);
      } catch (error) {
        next(
          ApiError.badRequest("При обновлении продукта произошла ошибка", error)
        );
      }
    };

  delete: RequestHandler<{ id: string }, void, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const productId = parseInt(req.params.id);

      await productService.delete(productId);

      res.status(200).end();
    } catch (error) {
      next(
        ApiError.badRequest("При удалении продукта произошла ошибка", error)
      );
    }
  };
}

export const productController = new ProductController();
