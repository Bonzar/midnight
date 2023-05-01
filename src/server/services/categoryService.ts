import type { ICategoryAttributes } from "../models/Category";
import { Category } from "../models/Category";

type CreateCategoryData = Omit<ICategoryAttributes, "id">;
type UpdateCategoryData = Omit<Partial<ICategoryAttributes>, "id">;

class CategoryService {
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
    if (!id) {
      throw new Error("Для обновления категории не был предоставлен ID");
    }

    const category = await Category.findOne({ where: { id } });

    if (!category) {
      throw new Error(`Категория с id - ${id} не найдена`);
    }

    return await category.update(updateData);
  }

  async delete(id: number) {
    if (!id) {
      throw new Error("Для удаления категории не был предоставлен ID");
    }

    const category = await Category.findOne({ where: { id } });

    if (!category) {
      throw new Error(`Категория с id - ${id} не найдена`);
    }

    return await category.destroy();
  }
}

export const categoryService = new CategoryService();
