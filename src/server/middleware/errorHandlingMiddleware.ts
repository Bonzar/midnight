import type { ErrorRequestHandler } from "express";
import { ApiError } from "../error/ApiError";

export const errorHandlingMiddleware: ErrorRequestHandler = (err, req, res) => {
  let apiError;
  if (err instanceof ApiError) {
    apiError = err;
  } else {
    apiError = ApiError.internal("Unexpected Error!", err);
  }

  return res.status(apiError.status).json(apiError);
};
