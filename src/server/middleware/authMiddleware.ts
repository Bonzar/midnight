import type { RequestHandler } from "express";
import { ApiError } from "../error/ApiError";
import { verify as jwtVerify } from "jsonwebtoken";
import * as process from "process";
import type { UserJwtPayload } from "../services/userService";

export const authMiddleware: RequestHandler<any, any, any, any> = (
  req,
  res,
  next
) => {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(ApiError.notAuthorize("Пользователь не авторизован"));
    }

    req.user = jwtVerify(token, process.env.JWT_SECRET) as UserJwtPayload;
    next();
  } catch (error) {
    next(ApiError.notAuthorize("Пользователь не авторизован", error));
  }
};
