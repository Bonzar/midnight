import { processDbError } from "./processDbError";

export interface IApiErrorItem {
  code: string;
  message: string;
}

export class ApiError extends Error {
  status;
  errors;

  constructor(status: number, message: string, errors: IApiErrorItem[] = []) {
    super();
    this.status = status;
    this.message = message;
    this.errors = errors;
  }

  static #formatError(error: unknown): IApiErrorItem | IApiErrorItem[] {
    // DB Errors
    const dbError = processDbError(error);
    if (dbError) return dbError;

    // Basic Error - should be penultimate
    if (error instanceof Error) {
      return { code: "ERROR", message: error.message };
    }

    // Not Error at all
    return { code: "NOT_ERROR", message: `${error}` };
  }

  static #processErrors(errors: unknown | unknown[]): IApiErrorItem[] {
    const errorsToProcess: unknown[] =
      errors instanceof Array ? errors : [errors];

    const processedErrors: IApiErrorItem[] = [];
    for (const errorToProcess of errorsToProcess) {
      const appError = this.#formatError(errorToProcess);

      const appErrorsArray = appError instanceof Array ? appError : [appError];

      processedErrors.push(...appErrorsArray);
    }

    return processedErrors;
  }

  static setDefaultMessage(clientMessage: string, error?: unknown) {
    if (!(error instanceof ApiError)) {
      return this.internal(clientMessage, error);
    }

    return error;
  }

  static badRequest(message: string, errors: unknown | unknown[] = []) {
    return new ApiError(400, message, this.#processErrors(errors));
  }

  static internal(message: string, errors: unknown | unknown[] = []) {
    return new ApiError(500, message, this.#processErrors(errors));
  }

  static unauthorized(errors: unknown | unknown[] = []) {
    return new ApiError(
      401,
      "Пользователь не авторизован",
      this.#processErrors(errors)
    );
  }

  static forbidden(errors: unknown | unknown[] = []) {
    return new ApiError(
      403,
      "У вас нет доступа к этой операции",
      this.#processErrors(errors)
    );
  }
}
