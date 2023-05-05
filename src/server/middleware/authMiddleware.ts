import type { RequestHandler } from "express";
import { ApiError } from "../error/ApiError";
import { tokenService } from "../services/tokenService";

export const authMiddleware: RequestHandler<any, any, any, any> = (
  req,
  res,
  next
) => {
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

    req.user = userDto;
    next();
  } catch (error) {
    next(ApiError.unauthorized(error));
  }
};
