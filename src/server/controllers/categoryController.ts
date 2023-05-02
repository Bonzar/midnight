import type { RequestHandler } from "express";
import type { Category } from "../models/Category";
import { ApiError } from "../error/ApiError";
import type {
  CreateCategoryData,
  UpdateCategoryData,
} from "../services/categoryService";
import { categoryService } from "../services/categoryService";
import { parseInt } from "../../helpers/parseInt";

export type CreateCategoryBody = CreateCategoryData;
export type UpdateCategoryBody = UpdateCategoryData;

class CategoryController {
  create: RequestHandler<void, Category, CreateCategoryBody, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const category = await categoryService.create(req.body);

      res.status(200).json(category);
    } catch (error) {
      next(
        ApiError.badRequest("При создании категории произошла ошибка", error)
      );
    }
  };

  getAll: RequestHandler<void, Category[], void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const allCategories = await categoryService.getAll();

      res.status(200).json(allCategories);
    } catch (error) {
      next(
        ApiError.badRequest(
          "При получении всех категорий произошла ошибка",
          error
        )
      );
    }
  };

  update: RequestHandler<{ id: string }, Category, UpdateCategoryBody, void> =
    async (req, res, next) => {
      try {
        const categoryId = parseInt(req.params.id);

        const updatedCategory = await categoryService.update(
          categoryId,
          req.body
        );

        res.status(200).json(updatedCategory);
      } catch (error) {
        next(
          ApiError.badRequest(
            `При обновлении категории с id - ${req.params.id} произошла ошибка`,
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
      const categoryId = parseInt(req.params.id);

      await categoryService.delete(categoryId);

      res.status(200);
    } catch (error) {
      next(
        ApiError.badRequest(
          `При удалении категории с id - ${req.params.id} произошла ошибка`,
          error
        )
      );
    }
  };
}

export const categoryController = new CategoryController();
