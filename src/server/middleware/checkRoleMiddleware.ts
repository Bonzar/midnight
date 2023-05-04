import type { RequestHandler } from "express";
import { ApiError } from "../error/ApiError";
import { verify as jwtVerify } from "jsonwebtoken";
import * as process from "process";
import type { UserJwtPayload } from "../services/userService";
import type { User } from "../models/User";

export const checkRoleMiddleware =
  (role: User["role"]): RequestHandler<any, any, any, any> =>
  (req, res, next) => {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return next(ApiError.notAuthorize("Ошибка авторизации"));
      }

      const decodedToken = jwtVerify(
        token,
        process.env.JWT_SECRET
      ) as UserJwtPayload;

      if (decodedToken.role !== role) {
        next(ApiError.forbidden("У вас нет доступа к этой операции"));
      }

      req.user = decodedToken;
      next();
    } catch (error) {
      next(ApiError.notAuthorize("Ошибка авторизации"));
    }
  };
