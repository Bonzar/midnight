import type { RequestHandler } from "express";
import type {
  CategoryAttributes,
  CategoryAttributesWithAssociations,
} from "../models/Category";
import { ApiError } from "../error/ApiError";
import type {
  CreateCategoryData,
  UpdateCategoryData,
} from "../services/categoryService";
import { categoryService } from "../services/categoryService";
import { parseAppInt } from "../../helpers/parseAppInt";

type NestedChildCategories = CategoryAttributesWithAssociations<
  never,
  { childCategories: NestedChildCategories[] }
>;

export type CreateCategoryBody = CreateCategoryData;
export type CreateCategoryResponse = CategoryAttributes;

export type GetAllCategoriesResponse = NestedChildCategories[];

export type UpdateCategoryBody = UpdateCategoryData;
export type UpdateCategoryResponse = CategoryAttributes;

class CategoryController {
  create: RequestHandler<
    void,
    CreateCategoryResponse,
    CreateCategoryBody,
    void
  > = async (req, res, next) => {
    try {
      const category = await categoryService.create(req.body);

      res.status(200).json(category);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При создании категории произошла ошибка",
          error
        )
      );
    }
  };

  getAll: RequestHandler<void, GetAllCategoriesResponse, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const allCategories = await categoryService.getAll();

      res.status(200).json(allCategories);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При получении всех категорий произошла ошибка",
          error
        )
      );
    }
  };

  update: RequestHandler<
    { id: string },
    UpdateCategoryResponse,
    UpdateCategoryBody,
    void
  > = async (req, res, next) => {
    try {
      const categoryId = parseAppInt(req.params.id);

      const updatedCategory = await categoryService.update(
        categoryId,
        req.body
      );

      res.status(200).json(updatedCategory);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
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
      const categoryId = parseAppInt(req.params.id);

      await categoryService.delete(categoryId);

      res.status(200).end();
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          `При удалении категории с id - ${req.params.id} произошла ошибка`,
          error
        )
      );
    }
  };
}

export const categoryController = new CategoryController();
