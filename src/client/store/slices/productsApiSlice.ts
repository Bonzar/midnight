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
    getProduct: build.query<GetProductResponse, number>({
      query: (id) => `product/${id}`,
    }),
    getAllProducts: build.mutation<GetAllProductsResponse, void>({
      query: () => "product",
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetAllProductsMutation,
  useGetProductQuery,
} = productsApiSlice;
