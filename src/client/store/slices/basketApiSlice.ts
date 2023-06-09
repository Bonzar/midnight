import { apiSlice } from "../apiSlice";
import type {
  AddBasketCouponBody,
  AddBasketCouponResponse,
  AddBasketProductBody,
  AddBasketProductResponse,
  DeleteBasketCouponBody,
  DeleteBasketProductBody,
  GetBasketResponse,
  UpdateBasketProductBody,
  UpdateBasketProductResponse,
} from "../../../server/controllers/basketController";
import { withErrorTags } from "../helpers/rtkQueryCacheUtils";

export const basketApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getBasket: build.query<GetBasketResponse, void>({
      query: () => "basket",
      providesTags: withErrorTags(["Basket", "AUTHORIZED"]),
    }),
    addBasketProduct: build.mutation<
      AddBasketProductResponse,
      AddBasketProductBody
    >({
      query: (body) => ({ url: "basket/product", method: "POST", body }),
      invalidatesTags: ["Basket"],
    }),
    updateBasketProduct: build.mutation<
      UpdateBasketProductResponse,
      UpdateBasketProductBody
    >({
      query: (body) => ({ url: "basket/product", method: "PATCH", body }),
      invalidatesTags: ["Basket"],
    }),
    deleteBasketProduct: build.mutation<void, DeleteBasketProductBody>({
      query: (body) => ({ url: "basket/product", method: "DELETE", body }),
      invalidatesTags: ["Basket"],
    }),
    addBasketCoupon: build.mutation<
      AddBasketCouponResponse,
      AddBasketCouponBody
    >({
      query: (body) => ({ url: "basket/coupon", method: "POST", body }),
      invalidatesTags: ["Basket"],
    }),
    deleteBasketCoupon: build.mutation<void, DeleteBasketCouponBody>({
      query: (body) => ({ url: "basket/coupon", method: "DELETE", body }),
      invalidatesTags: ["Basket"],
    }),
  }),
});

export const {
  useGetBasketQuery,
  useAddBasketCouponMutation,
  useAddBasketProductMutation,
  useDeleteBasketCouponMutation,
  useDeleteBasketProductMutation,
  useUpdateBasketProductMutation,
} = basketApiSlice;
