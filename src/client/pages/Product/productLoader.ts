import type { LoaderArgs } from "../../routes/helpers/createLoader";
import { createLoader } from "../../routes/helpers/createLoader";
import { parseAppInt } from "../../../helpers/parseAppInt";
import { productsApiSlice } from "../../store/slices/productsApiSlice";
import { awaitLoadDataOnServer } from "../../routes/helpers/awaitLoadDataOnServer";
import { isApiError } from "../../utils/isApiError";
import { redirect } from "react-router-dom";
import { has } from "ramda";

export const productLoader = createLoader(
  ({ dispatch }) =>
    async ({ params, request }: LoaderArgs<"id">) => {
      const id = params.id ? parseAppInt(params.id) : null;
      if (id === null) {
        throw new Response("Не верный id продукта", { status: 404 });
      }

      const productPromise = dispatch(
        productsApiSlice.endpoints.getDetailedProduct.initiate(id)
      );

      try {
        await awaitLoadDataOnServer(productPromise, request, true);
      } catch (error) {
        if (
          has("data", error) &&
          isApiError(error.data) &&
          error.data.status === 404
        ) {
          return redirect("/not-found");
        }
      }

      return null;
    }
);
