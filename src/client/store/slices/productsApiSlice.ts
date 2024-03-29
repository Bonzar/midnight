import { apiSlice } from "../apiSlice";
import type {
  GetAllProductsResponse,
  GetProductResponse,
} from "../../../server/controllers/productController";
import { withArgAsId, withNestedList } from "../helpers/apiCacheUtils";

export const productsApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getProducts: build.query<GetAllProductsResponse, void>({
      query: () => "product",
      providesTags: withNestedList(
        "Product",
        (result: GetAllProductsResponse) => result.rows
      )(),
    }),
    getDetailedProduct: build.query<GetProductResponse, number>({
      query: (id) => `product/${id}`,
      providesTags: withArgAsId("Product")(),
    }),
  }),
});

export const { useGetProductsQuery, useGetDetailedProductQuery } =
  productsApiSlice;
