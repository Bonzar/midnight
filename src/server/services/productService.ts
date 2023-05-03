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
import type { Transaction } from "sequelize";

export type CreateProductData = ProductCreationAttributes;
export type UpdateProductData = Partial<ProductCreationAttributes>;

class ProductService {
  async create(data: CreateProductData) {
    return await Product.create(data);
  }

  async getOne(id: number, transaction?: Transaction) {
    if (!id) {
      throw new Error("Для получения товара не был предоставлен ID");
    }

    const product = await Product.findOne({
      where: { id },
      transaction,
    });

    this.checkExist(product, id);

    return product;
  }

  async getDetailed(id: number) {
    if (!id) {
      throw new Error("Для получения товара не был предоставлен ID");
    }

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

    this.checkExist(product, id);

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
    const product = await this.getOne(id);

    return await product.update(data);
  }

  async delete(id: number) {
    const product = await this.getOne(id);

    return await product.destroy();
  }

  async checkStock(id: number, quantity: number) {
    const product = await this.getOne(id);

    if (product.stock === 0) {
      throw new Error(`К сожалению товар с id - ${id} — закончился`);
    }

    if (product.stock < quantity) {
      throw new Error(
        `Максимально доступное количество товара с id - ${id} — ${product.stock} шт.`
      );
    }
  }

  checkExist(product: Product | null, id: number): asserts product is Product {
    if (!product) {
      throw new Error(`Продукт с id - ${id} не найден`);
    }
  }
}

export const productService = new ProductService();
