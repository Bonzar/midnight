import type { ProductMetaCreationAttributes } from "../models/ProductMeta";
import { ProductMeta } from "../models/ProductMeta";
import { ApiError } from "../error/ApiError";

export type CreateProductMetaData = ProductMetaCreationAttributes;
export type UpdateProductMetaData = Partial<ProductMetaCreationAttributes>;

class ProductMetaService {
  async create(data: CreateProductMetaData) {
    return await ProductMeta.create(data);
  }

  async getOne(id: number) {
    if (!id) {
      throw ApiError.badRequest(
        "Для получения характеристики товара не был предоставлен ID"
      );
    }

    const productMeta = await ProductMeta.findOne({ where: { id } });

    if (!productMeta) {
      throw ApiError.badRequest(
        `Характеристика товара с id - ${id} не найдена`
      );
    }

    return productMeta;
  }

  async update(id: number, updateData: UpdateProductMetaData) {
    const productMeta = await this.getOne(id);

    return await productMeta.update(updateData);
  }

  async delete(id: number) {
    const productMeta = await this.getOne(id);

    return await productMeta.destroy();
  }
}

export const productMetaService = new ProductMetaService();
