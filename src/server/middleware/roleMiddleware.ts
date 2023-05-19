import type { RequestHandler } from "express";
import { ApiError } from "../error/ApiError";
import type { User } from "../models/User";
import { tokenService } from "../services/tokenService";

interface IDefaultOptions {
  invertSelection: boolean;
}

const defaultOptions: IDefaultOptions = {
  invertSelection: false,
};

export const roleMiddleware =
  (
    roles: Array<User["role"]>,
    options = defaultOptions
  ): RequestHandler<any, any, any, any> =>
  (req, res, next) => {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      options = { ...defaultOptions, ...options };

      const accessToken = req.headers.authorization?.split(" ")[1];
      if (!accessToken) {
        return next(ApiError.unauthorized());
      }

      const userDto = tokenService.validateAccessToken(accessToken);
      if (!userDto) {
        return next(ApiError.unauthorized());
      }

      // user should NOT have specified roles
      if (options.invertSelection) {
        if (roles.includes(userDto.role)) {
          return next(ApiError.forbidden());
        }
      }
      // user should have specified roles
      else if (!roles.includes(userDto.role)) {
        return next(ApiError.forbidden());
      }

      req.user = userDto;
      next();
    } catch (error) {
      next(ApiError.unauthorized(error));
    }
  };
