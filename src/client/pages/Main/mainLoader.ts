import { createLoader } from "../../routes/helpers/createLoader";
import { productsApiSlice } from "../../store/slices/productsApiSlice";
import { awaitLoadDataOnServer } from "../../routes/helpers/awaitLoadDataOnServer";

export const mainLoader = createLoader(
  ({ dispatch }) =>
    async ({ request }) => {
      const productsPromise = dispatch(
        productsApiSlice.endpoints.getProducts.initiate()
      );

      await awaitLoadDataOnServer(productsPromise, request);

      return null;
    }
);
