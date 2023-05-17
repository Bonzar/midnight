import type { QueryActionCreatorResult } from "@reduxjs/toolkit/dist/query/core/buildInitiate";

export const awaitLoadDataOnServer = async (
  query: QueryActionCreatorResult<any>,
  req: Request,
  isThrowError: boolean = false
) => {
  req.signal.onabort = query.abort;
  query.unsubscribe();

  if (import.meta.env.SSR) {
    try {
      await query.unwrap();
    } catch (error) {
      /* skip error logging on production */
      if (process.env.NODE_ENV === "development") {
        console.log(error);
      }

      if (isThrowError) {
        throw error;
      }
    }
  }
};
