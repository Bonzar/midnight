import { useMemo } from "react";
import { createSelector } from "@reduxjs/toolkit";
import type { GetBasketResponse } from "../../server/controllers/basketController";
import { useGetBasketQuery } from "../store/slices/basketApiSlice";

export const useBasketProduct = (productId: number) => {
  const selectBasketProduct = useMemo(() => {
    return createSelector(
      (res: { data?: GetBasketResponse }) => res.data,
      (res: { data?: GetBasketResponse }, productId: number) => productId,
      (data, productId) =>
        data?.basket.basketProducts.find(
          (basketProduct) => basketProduct.productId === productId
        )
    );
  }, []);

  return useGetBasketQuery(undefined, {
    selectFromResult: (result) => ({
      basketProduct: selectBasketProduct(result, productId),
    }),
  });
};
