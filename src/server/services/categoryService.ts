import type { CategoryCreationAttributes } from "../models/Category";
import { Category } from "../models/Category";
import type { Transaction } from "sequelize";

export type CreateCategoryData = CategoryCreationAttributes;
export type UpdateCategoryData = Partial<CategoryCreationAttributes>;

class CategoryService {
  async getOne(id: number, transaction?: Transaction) {
    if (!id) {
      throw new Error("Для получения категории не был предоставлен ID");
    }

    const category = await Category.findOne({
      where: { id },
      transaction,
    });

    if (!category) {
      throw new Error(`Категория с id - ${id} не найдена`);
    }

    return category;
  }

  async create(data: CreateCategoryData) {
    return await Category.create(data);
  }

  async getAll() {
    return await Category.findAll({
      include: {
        model: Category,
        as: "childCategories",
        nested: true,
      },
    });
  }

  async update(id: number, updateData: UpdateCategoryData) {
    const category = await this.getOne(id);

    return await category.update(updateData);
  }

  async delete(id: number) {
    const category = await this.getOne(id);

    return await category.destroy();
  }
}

export const categoryService = new CategoryService();
