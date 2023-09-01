import type {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { isApiError } from "../../utils/isApiError";

type TransformErrorResponse = (
  baseQueryReturnValue: FetchBaseQueryError,
  meta: FetchBaseQueryMeta | undefined,
  arg: unknown
) => void;

export const toastApiErrorResponse =
  <Fn extends TransformErrorResponse>(callback?: Fn): TransformErrorResponse =>
  (baseQueryReturnValue, ...other) => {
    if (import.meta.env.SSR) {
      return baseQueryReturnValue;
    }

    const { status, data } = baseQueryReturnValue;

    // @ts-ignore
    import("iziToast")
      .then((module) => {
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
      })
      .catch(console.error);

    if (!callback) {
      return baseQueryReturnValue;
    }

    return callback(baseQueryReturnValue, ...other);
  };
