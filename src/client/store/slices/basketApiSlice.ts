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
  invalidatesList,
  withNestedList,
  withNestedResultId,
} from "../helpers/rtkQueryCacheUtils";
import { pipe } from "ramda";

export const basketApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getBasket: build.query<GetBasketResponse, void>({
      query: () => "basket",
      providesTags: (result, error, arg) => {
        return pipe(
          withNestedList(
            "BasketProduct",
            (result: GetBasketResponse) => result.basket.basketProducts
          ),
          withNestedList(
            "BasketCoupon",
            (result: GetBasketResponse) => result.basket.basketCoupons
          )
        )(["AUTHORIZED"])(result, error, arg);
      },
    }),
    addBasketProduct: build.mutation<
      AddBasketProductResponse,
      AddBasketProductBody
    >({
      query: (body) => ({ url: "basket/product", method: "POST", body }),
      invalidatesTags: invalidatesList("BasketProduct")(),
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
      invalidatesTags: invalidatesList("BasketProduct")(),
    }),
    addBasketCoupon: build.mutation<
      AddBasketCouponResponse,
      AddBasketCouponBody
    >({
      query: (body) => ({ url: "basket/coupon", method: "POST", body }),
      invalidatesTags: invalidatesList("BasketCoupon")(),
    }),
    deleteBasketCoupon: build.mutation<void, DeleteBasketCouponBody>({
      query: (body) => ({ url: "basket/coupon", method: "DELETE", body }),
      invalidatesTags: invalidatesList("BasketCoupon")(),
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
