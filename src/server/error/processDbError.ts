import { ValidationError } from "sequelize";
import type { IApiErrorItem } from "./ApiError";

export const processDbError = (
  error: unknown
): IApiErrorItem | IApiErrorItem[] | void => {
  // ValidationError
  if (error instanceof ValidationError) {
    return error.errors.map((error) => ({
      code: "DB_VALIDATION_ERROR",
      message: error.message,
    }));
  }
};
