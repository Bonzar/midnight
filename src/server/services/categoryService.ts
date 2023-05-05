import type { CategoryCreationAttributes } from "../models/Category";
import { Category } from "../models/Category";
import { ApiError } from "../error/ApiError";

export type CreateCategoryData = CategoryCreationAttributes;
export type UpdateCategoryData = Partial<CategoryCreationAttributes>;

class CategoryService {
  async getOne(id: number) {
    if (!id) {
      throw ApiError.badRequest(
        "Для получения категории не был предоставлен ID"
      );
    }

    const category = await Category.findOne({ where: { id } });

    if (!category) {
      throw ApiError.badRequest(`Категория с id - ${id} не найдена`);
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
