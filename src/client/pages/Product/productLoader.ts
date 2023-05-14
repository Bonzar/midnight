import type { LoaderArgs } from "../../routes/createLoader";
import { createLoader } from "../../routes/createLoader";
import { parseAppInt } from "../../../helpers/parseAppInt";
import { productsApiSlice } from "../../store/slices/productsApiSlice";

export const productLoader = createLoader(
  ({ dispatch }) =>
    async ({ params, request }: LoaderArgs<"id">) => {
      const id = params.id ? parseAppInt(params.id) : null;
      if (!id) {
        throw new Response("Не верный id продукта", { status: 404 });
      }

      const productPromise = dispatch(
        productsApiSlice.endpoints.getDetailedProduct.initiate(id)
      );
      request.signal.onabort = productPromise.abort;
      productPromise.unsubscribe();

      if (import.meta.env.SSR) {
        await productPromise.unwrap();
      }

      return null;
    }
);
