import type { IApiError, IApiErrorItem } from "../../server/error/ApiError";
import { exhaustiveCheck } from "../../helpers/exhaustiveCheck";
import { has } from "ramda";
import { isObjHasPropType } from "./js/isHasPropType";

const isApiErrorItem = (error: unknown): error is IApiErrorItem => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const isErrorHas = isObjHasPropType(error);

  for (const errorKey of Object.keys(error)) {
    // reassign for exhaustiveCheck
    const currentKey = errorKey as keyof IApiErrorItem;

    switch (currentKey) {
      case "message":
        if (!isErrorHas("message", "string")) {
          return false;
        }
        break;
      case "code":
        if (!isErrorHas("code", "string")) {
          return false;
        }
        break;
      default:
        exhaustiveCheck(currentKey);
        return false;
    }
  }

  return true;
};

export const isApiError = (error: unknown): error is IApiError => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const isErrorHas = isObjHasPropType(error);

  for (const errorKey of Object.keys(error)) {
    // reassign for exhaustiveCheck
    const currentKey = errorKey as keyof IApiError;

    switch (currentKey) {
      case "errors":
        if (!(has("errors", error) && error.errors instanceof Array)) {
          return false;
        }

        if (!error.errors.every(isApiErrorItem)) {
          return false;
        }

        break;
      case "message":
        if (!isErrorHas("message", "string")) {
          return false;
        }
        break;
      case "status":
        if (!isErrorHas("status", "number")) {
          return false;
        }
        break;
      default:
        exhaustiveCheck(currentKey);
        return false;
    }
  }

  return true;
};
