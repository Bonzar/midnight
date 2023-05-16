interface ClientApiError {
  message: string;
  errors: {
    code: string;
    message: string;
  }[];
}

export const isApiError = (error: unknown): error is ClientApiError => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  if (!("message" in error) || typeof error.message !== "string") {
    return false;
  }

  if (!("errors" in error) || !(error.errors instanceof Array)) {
    return false;
  }

  if (error.errors.length > 0) {
    const oneError = error.errors[0];

    if (!("code" in oneError) || typeof oneError.code !== "string") {
      return false;
    }

    if (!("message" in oneError) || typeof oneError.message !== "string") {
      return false;
    }
  }

  return true;
};
