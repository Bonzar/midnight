import { apiSlice } from "../apiSlice";
import type {
  AddBasketCouponBody,
  AddBasketCouponResponse,
  AddBasketProductBody,
  AddBasketProductResponse,
  DeleteBasketCouponBody,
  DeleteBasketProductBody,
  GetBasketResponse,
  GuestAddCouponQuery,
  GuestAddCouponResponse,
  GuestAddProductQuery,
  GuestAddProductResponse,
  UpdateBasketProductBody,
  UpdateBasketProductResponse,
} from "../../../server/controllers/basketController";

export const basketApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getBasket: build.query<GetBasketResponse, void>({
      query: () => "basket",
      providesTags: ["Basket"],
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
    guestAddBasketProduct: build.mutation<
      GuestAddProductResponse,
      GuestAddProductQuery
    >({
      query: (params) => ({ url: "basket/product/guest", params }),
    }),
    guestAddBasketCoupon: build.mutation<
      GuestAddCouponResponse,
      GuestAddCouponQuery
    >({
      query: (params) => ({ url: "basket/coupon/guest", params }),
    }),
  }),
});

export const {
  useGetBasketQuery,
  useAddBasketCouponMutation,
  useAddBasketProductMutation,
  useDeleteBasketCouponMutation,
  useDeleteBasketProductMutation,
  useGuestAddBasketCouponMutation,
  useGuestAddBasketProductMutation,
  useUpdateBasketProductMutation,
} = basketApiSlice;
