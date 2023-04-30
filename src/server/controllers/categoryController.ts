import type { NextFunction, Request, Response } from "express";
import { Category } from "../models/Category";
import { ApiError } from "../error/ApiError";

//todo use RequestHandler instead (req: Request, res: Response, next: NextFunction
class CategoryController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        parentCategoryId,
      }: { name: string; parentCategoryId?: number } = req.body;

      const newCategory = await Category.create({ name, parentCategoryId });

      return res.json(newCategory);
    } catch (error) {
      next(ApiError.badRequest("Ошибка создания категории", error));
    }
  }

  async get(req: Request, res: Response) {}

  async update(req: Request, res: Response) {}

  async delete(req: Request, res: Response) {}
}

export const categoryController = new CategoryController();
