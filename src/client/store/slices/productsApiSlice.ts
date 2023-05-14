import { apiSlice } from "../apiSlice";
import type {
  GetAllProductsResponse,
  GetProductResponse,
} from "../../../server/controllers/productController";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<GetAllProductsResponse, void>({
      query: () => "product",
    }),
    getDetailedProduct: build.query<GetProductResponse, number>({
      query: (id) => `product/${id}`,
    }),
  }),
});

export const { useGetProductsQuery, useGetDetailedProductQuery } =
  productsApiSlice;
