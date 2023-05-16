import { apiSlice } from "../apiSlice";
import type {
  GetAllProductsResponse,
  GetProductResponse,
} from "../../../server/controllers/productController";
import { toastApiError } from "../../utils/toastApiError";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<GetAllProductsResponse, void>({
      query: () => "product",
      transformErrorResponse: toastApiError(),
    }),
    getDetailedProduct: build.query<GetProductResponse, number>({
      query: (id) => `product/${id}`,
      transformErrorResponse: toastApiError(),
    }),
  }),
});

export const { useGetProductsQuery, useGetDetailedProductQuery } =
  productsApiSlice;
