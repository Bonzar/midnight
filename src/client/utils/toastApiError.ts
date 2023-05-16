import type {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { isApiError } from "./isApiError";

type TransformErrorResponse = (
  baseQueryReturnValue: FetchBaseQueryError,
  meta: FetchBaseQueryMeta | undefined,
  arg: unknown
) => void;

export const toastApiError =
  <Fn extends TransformErrorResponse>(callback?: Fn): TransformErrorResponse =>
  (baseQueryReturnValue, meta, arg) => {
    if (import.meta.env.SSR) return;

    const { status, data } = baseQueryReturnValue;

    // @ts-ignore
    import("iziToast/dist/js/iziToast.min").then((module) => {
      const izitoast = module.default;

      if (!isApiError(data)) return;

      if (data.errors.length > 0) {
        return data.errors.forEach(({ code, message }) => {
          izitoast.error({
            title: `Code: ${code}`,
            message,
          });
        });
      }

      izitoast.error({
        title: `Status: ${status}`,
        message: data.message,
      });
    });

    if (!callback) {
      return baseQueryReturnValue;
    }

    return callback(baseQueryReturnValue, meta, arg);
  };
