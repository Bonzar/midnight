import type { RequestHandler } from "express";
import { ApiError } from "../error/ApiError";
import type { User } from "../models/User";
import { tokenService } from "../services/tokenService";

export const roleMiddleware =
  (role: User["role"]): RequestHandler<any, any, any, any> =>
  (req, res, next) => {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const accessToken = req.headers.authorization?.split(" ")[1];
      if (!accessToken) {
        return next(ApiError.unauthorized());
      }

      const userDto = tokenService.validateAccessToken(accessToken);
      if (!userDto) {
        return next(ApiError.unauthorized());
      }

      if (userDto.role !== role) {
        next(ApiError.forbidden());
      }

      req.user = userDto;
      next();
    } catch (error) {
      next(ApiError.unauthorized(error));
    }
  };
