import type { IProductMetaCreationAttributes } from "../models/ProductMeta";
import { ProductMeta } from "../models/ProductMeta";

export type CreateProductMetaData = Omit<IProductMetaCreationAttributes, "id">;

export type UpdateProductMetaData = Omit<
  Partial<IProductMetaCreationAttributes>,
  "id"
>;

class ProductMetaService {
  async create(data: CreateProductMetaData) {
    return await ProductMeta.create(data);
  }

  async update(id: number, updateData: UpdateProductMetaData) {
    if (!id) {
      throw new Error("Для обновления характеристики не был предоставлен ID");
    }

    const productMeta = await ProductMeta.findOne({ where: { id } });

    if (!productMeta) {
      throw new Error(`Характеристика товара с id - ${id} не найдена`);
    }

    return await productMeta.update(updateData);
  }

  async delete(id: number) {
    if (!id) {
      throw new Error("Для удаления характеристики не был предоставлен ID");
    }

    const productMeta = await ProductMeta.findOne({ where: { id } });

    if (!productMeta) {
      throw new Error(`Характеристика товара с id - ${id} не найдена`);
    }

    return await productMeta.destroy();
  }
}

export const productMetaService = new ProductMetaService();
