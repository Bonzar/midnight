import { ValidationError } from "sequelize";

export const processDbError = (error: unknown) => {
  // ValidationError
  if (error instanceof ValidationError) {
    return `Ошибка валидации: ${error.errors
      .map((error) => error.message)
      .join(", ")}`;
  }
};
