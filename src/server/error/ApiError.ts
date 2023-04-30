import { processDbError } from "./processDbError";

export class ApiError extends Error {
  status;

  constructor(status: number, message: string) {
    super();
    this.status = status;
    this.message = message;
  }

  private static getErrorMessage(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error ?? "Ошибка не предоставлена");
    }

    // DB Errors
    const dbError = processDbError(error);
    if (dbError) return dbError;

    // Basic Error - should be penultimate
    if (error instanceof Error) {
      return error.message;
    }

    // Not Error at all
    return error;
  }

  static badRequest(defaultMessage: string, error?: unknown) {
    const message = this.getErrorMessage(error);

    return new ApiError(400, message?.toString() ?? defaultMessage);
  }

  static internal(defaultMessage: string, error?: unknown) {
    const message = this.getErrorMessage(error);

    return new ApiError(500, message?.toString() ?? defaultMessage);
  }

  static forbidden(defaultMessage: string, error?: unknown) {
    const message = this.getErrorMessage(error);

    return new ApiError(403, message?.toString() ?? defaultMessage);
  }
}
