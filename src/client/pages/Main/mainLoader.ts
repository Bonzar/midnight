import { createLoader } from "../../routes/createLoader";
import { productsApiSlice } from "../../store/slices/productsApiSlice";

export const mainLoader = createLoader(
  ({ dispatch }) =>
    async ({ request }) => {
      const productsPromise = dispatch(
        productsApiSlice.endpoints.getProducts.initiate()
      );

      productsPromise.unsubscribe();
      request.signal.onabort = productsPromise.abort;

      if (import.meta.env.SSR) {
        await productsPromise.unwrap();
      }

      return null;
    }
);
