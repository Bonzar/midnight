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
import {
  invalidateList,
  withNestedList,
  withNestedResultId,
  withTags,
} from "../helpers/apiCacheUtils";

export const basketApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getBasket: build.query<GetBasketResponse, void>({
      query: () => "basket",
      providesTags: withTags<GetBasketResponse, void>([
        withNestedList(
          "BasketProduct",
          (result) => result.basket.basketProducts
        ),
        withNestedList("BasketCoupon", (result) => result.basket.basketCoupons),
      ])(["AUTHORIZED"]),
    }),
    addBasketProduct: build.mutation<
      AddBasketProductResponse,
      AddBasketProductBody
    >({
      query: (body) => ({ url: "basket/product", method: "POST", body }),
      invalidatesTags: invalidateList("BasketProduct")(),
    }),
    updateBasketProduct: build.mutation<
      UpdateBasketProductResponse,
      UpdateBasketProductBody
    >({
      query: (body) => ({ url: "basket/product", method: "PATCH", body }),
      invalidatesTags: withNestedResultId(
        "BasketProduct",
        (result: UpdateBasketProductResponse) => result.id
      )(),
    }),
    deleteBasketProduct: build.mutation<void, DeleteBasketProductBody>({
      query: (body) => ({ url: "basket/product", method: "DELETE", body }),
      invalidatesTags: invalidateList("BasketProduct")(),
    }),
    addBasketCoupon: build.mutation<
      AddBasketCouponResponse,
      AddBasketCouponBody
    >({
      query: (body) => ({ url: "basket/coupon", method: "POST", body }),
      invalidatesTags: invalidateList("BasketCoupon")(),
    }),
    deleteBasketCoupon: build.mutation<void, DeleteBasketCouponBody>({
      query: (body) => ({ url: "basket/coupon", method: "DELETE", body }),
      invalidatesTags: invalidateList("BasketCoupon")(),
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
