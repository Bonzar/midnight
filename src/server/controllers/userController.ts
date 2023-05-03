import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ApiError } from "../error/ApiError";
import type { CreateUserData } from "../services/userService";
import { userService } from "../services/userService";
import type { User } from "../models/User";

type RegistrationUserBody = CreateUserData;

class UserController {
  registration: RequestHandler<void, User, RegistrationUserBody, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const user = await userService.create(req.body);

      res.status(200).json(user);
    } catch (error) {
      next(
        ApiError.badRequest(
          "При регистрации пользователя произошла ошибка",
          error
        )
      );
    }
  };

  login: RequestHandler<void, User, { id: number }, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const user = await userService.getOne(req.body.id);

      res.status(200).json(user);
    } catch (error) {
      next(ApiError.badRequest("При  произошла ошибка", error));
    }
  };

  async check(req: Request, res: Response, next: NextFunction) {
    if (!req.query.id) {
      return next(ApiError.forbidden("Ошибка"));
    }

    res.status(200).json({ message: "hello" });
  }
}

export const userController = new UserController();
