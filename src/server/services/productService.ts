import type {
  ProductAttributes,
  ProductCreationAttributes,
} from "../models/Product";
import { Product } from "../models/Product";
import type { WhereOptions } from "sequelize";
import { ProductMeta } from "../models/ProductMeta";
import { ProductImage } from "../models/ProductImage";
import {
  DEFAULT_ITEMS_LIMIT,
  DEFAULT_ITEMS_PAGE,
} from "../../helpers/constants";
import { Category } from "../models/Category";

export type CreateProductData = ProductCreationAttributes;
export type UpdateProductData = Partial<ProductCreationAttributes>;

class ProductService {
  async create(data: CreateProductData) {
    return await Product.create(data);
  }
  async get(id: number) {
    const product = await Product.findOne({
      where: { id },
      include: [
        ProductImage,
        ProductMeta,
        {
          model: Category,
          include: [{ model: Category, as: "parentCategory", nested: true }],
        },
      ],
      order: [
        [{ model: ProductImage, as: "productImages" }, "sort", "ASC"],
        [{ model: ProductMeta, as: "productMetas" }, "title", "ASC"],
      ],
    });

    if (!product) {
      throw new Error(`Продукт с id - ${id} не найден`);
    }

    return product;
  }

  async getAll(
    categoryId?: number,
    limit: number = DEFAULT_ITEMS_LIMIT,
    page: number = DEFAULT_ITEMS_PAGE
  ) {
    const where: WhereOptions<ProductAttributes> = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const offset = limit * page - limit;

    return await Product.findAndCountAll({
      where,
      limit,
      offset,
      include: [{ model: ProductImage, limit: 1, order: [["sort", "ASC"]] }],
    });
  }

  async update(id: number, data: UpdateProductData) {
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      throw new Error("`Продукт с id - ${productId} не найден`");
    }

    return await product.update(data);
  }

  async delete(id: number) {
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      throw new Error(`Продукт с id - ${id} не найден`);
    }

    return await product.destroy();
  }
}

export const productService = new ProductService();
