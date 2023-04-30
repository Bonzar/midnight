import type { RequestHandler } from "express";
import { ApiError } from "../error/ApiError";
import type {
  IProductAttributes,
  IProductCreationAttributes,
} from "../models/Product";
import { Product } from "../models/Product";
import type { WhereOptions } from "sequelize";
import { parseInt } from "../../helpers/parseInt";
import { ProductMeta } from "../models/ProductMeta";
import { ProductImage } from "../models/ProductImage";
import {
  DEFAULT_ITEMS_LIMIT,
  DEFAULT_ITEMS_PAGE,
} from "../../helpers/constants";

class ProductController {
  create: RequestHandler<void, Product, IProductCreationAttributes, void> =
    async (req, res, next) => {
      try {
        const newProduct = await Product.create(req.body);

        return res.json(newProduct);
      } catch (error) {
        next(ApiError.badRequest("Ошибка создания продукта", error));
      }
    };

  get: RequestHandler<{ id: string }, Product, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const productId = parseInt(req.params.id);

      const product = await Product.findOne({
        where: { id: productId },
        include: [ProductImage, ProductMeta],
        order: [
          [{ model: ProductImage, as: "productImages" }, "sort", "ASC"],
          [{ model: ProductMeta, as: "productMetas" }, "title", "ASC"],
        ],
      });
      if (!product) {
        return next(
          ApiError.badRequest(`Продукт с id - ${productId} не найден`)
        );
      }

      return res.json(product);
    } catch (error) {
      next(ApiError.badRequest("Ошибка получения продукта", error));
    }
  };

  getAll: RequestHandler<
    void,
    { rows: Product[]; count: number },
    void,
    { categoryId?: string; limit?: string; page?: string }
  > = async (req, res, next) => {
    try {
      const where: WhereOptions<IProductAttributes> = {};
      if (req.query.categoryId) {
        where.categoryId = req.query.categoryId;
      }

      const limit = req.query.limit
        ? parseInt(req.query.limit)
        : DEFAULT_ITEMS_LIMIT;

      const page = req.query.page
        ? parseInt(req.query.page)
        : DEFAULT_ITEMS_PAGE;

      const offset = limit * page - limit;

      const products = await Product.findAndCountAll({
        where,
        limit,
        offset,
        include: [{ model: ProductImage, limit: 1, order: [["sort", "ASC"]] }],
      });

      return res.json(products);
    } catch (error) {
      next(ApiError.badRequest("Ошибка получения всех продуктов", error));
    }
  };

  update: RequestHandler<
    { id: string },
    Product,
    Partial<IProductCreationAttributes>,
    void
  > = async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);

      const product = await Product.findOne({ where: { id: productId } });
      if (!product) {
        return next(
          ApiError.badRequest(`Продукт с id - ${productId} не найден`)
        );
      }

      const updatedProduct = await product.update(req.body);

      return res.json(updatedProduct);
    } catch (error) {
      next(ApiError.badRequest("Ошибка обновления продукта", error));
    }
  };

  delete: RequestHandler<{ id: string }, void, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const productId = parseInt(req.params.id);

      const product = await Product.findOne({ where: { id: productId } });
      if (!product) {
        return next(
          ApiError.badRequest(`Продукт с id - ${productId} не найден`)
        );
      }

      await product.destroy();

      res.status(200).end();
    } catch (error) {
      next(ApiError.badRequest("Ошибка удаления продукта", error));
    }
  };
}

export const productController = new ProductController();
