import type { ErrorRequestHandler } from "express";
import { ApiError } from "../error/ApiError";

export const errorHandlingMiddleware: ErrorRequestHandler = (err, req, res) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }

  return res.status(500).json({ message: "Unexpected Error!" });
};
