import type { Action, Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { has } from "ramda";
import { isApiError } from "../../utils/isApiError";
import { NOOP } from "../../../helpers/NOOP";

/**
 * Show a toast on client
 */
export const rtkQueryErrorToastMiddleware: Middleware =
  () => (next) => (action: Action) => {
    if (import.meta.env.SSR) {
      return next(action);
    }

    if (isRejectedWithValue(action)) {
      if (!has("data", action.payload)) {
        return next(action);
      }

      const error = action.payload.data;

      // @ts-ignore
      import("iziToast")
        .then((module) => {
          const izitoast = module.default;

          // Skip toast unauthorized error
          if (!isApiError(error) || error.status === 401) return;

          if (error.errors.length > 0) {
            return error.errors.forEach(({ code, message }) => {
              izitoast.error({
                title: `Code: ${code}`,
                message,
              });
            });
          }

          izitoast.error({
            title: `Error: ${error.status}`,
            message: error.message,
          });
        })
        .catch(NOOP);
    }

    return next(action);
  };
