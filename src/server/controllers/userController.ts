import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../error/ApiError";

class UserController {
  async registration(req: Request, res: Response) {}

  async login(req: Request, res: Response) {}

  async check(req: Request, res: Response, next: NextFunction) {
    if (!req.query.id) {
      return next(ApiError.forbidden("Ошибка"));
    }

    res.status(200).json({ message: "hello" });
  }
}

export const userController = new UserController();
