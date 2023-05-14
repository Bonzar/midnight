import { createLoader } from "../../routes/createLoader";
import { productsApiSlice } from "../../store/slices/productsApiSlice";

export const mainLoader = createLoader((store) => async ({ request }) => {
  const productsPromise = store.dispatch(
    productsApiSlice.endpoints.getProducts.initiate()
  );

  productsPromise.unsubscribe();
  request.signal.onabort = productsPromise.abort;

  if (import.meta.env.SSR) {
    await productsPromise.unwrap();
  }

  return null;
});
