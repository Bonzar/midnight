import React, { useEffect, useMemo, useState } from "react";
import styles from "../basket.module.css";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Indent } from "../../../components/ui/Indent";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import {
  useDeleteBasketProductMutation,
  useGetBasketQuery,
  useUpdateBasketProductMutation,
} from "../../../store/slices/basketApiSlice";
import { createSelector } from "@reduxjs/toolkit";
import type { GetBasketResponse } from "../../../../server/controllers/basketController";
import { preventDefault } from "../../../utils/react/preventDefault";
import { parseAppInt } from "../../../../helpers/parseAppInt";
import { useDebouncedFunction } from "../../../hooks/useDebouncedFunction";
import { Link } from "react-router-dom";

interface IBasketProductProps {
  productId: number;
}

export const BasketProduct = React.memo(function BasketProductMemo({
  productId,
}: IBasketProductProps) {
  const [
    updateBasketProduct,
    { isLoading: isUpdateBasketProductLoading, isError },
  ] = useUpdateBasketProductMutation();
  const [deleteBasketProduct] = useDeleteBasketProductMutation();

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

  const { basketProduct } = useGetBasketQuery(undefined, {
    selectFromResult: (result) => ({
      basketProduct: selectBasketProduct(result, productId),
    }),
  });

  const [inputQuantity, setInputQuantity] = useState(
    basketProduct?.quantity ?? 0
  );

  useEffect(() => {
    if (isError && basketProduct?.quantity) {
      setInputQuantity(basketProduct.quantity);
    }
  }, [basketProduct?.quantity, isError]);

  useEffect(() => {
    if (basketProduct?.quantity) {
      setInputQuantity(basketProduct.quantity);
    }
  }, [basketProduct?.quantity]);

  const changeQuantity = (newQuantity: number) => {
    console.log({ newQuantity });
    if (newQuantity === 0) {
      return deleteBasketProduct({ productId });
    }

    return updateBasketProduct({ productId, quantity: newQuantity });
  };

  const handleChangeQuantityBtnClick = (isAddOperand: boolean) => () => {
    changeQuantity(isAddOperand ? inputQuantity + 1 : inputQuantity - 1);
  };

  const debouncedQuantityUpdate = useDebouncedFunction(
    (newQuantity: number) => changeQuantity(newQuantity),
    500
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseAppInt(event.currentTarget.value);
    if (isNaN(newQuantity)) return;

    setInputQuantity(newQuantity);
    debouncedQuantityUpdate(newQuantity);
  };

  if (!basketProduct) return null;
  const { product, quantity } = basketProduct;

  return (
    <Card className={styles.productCard}>
      <Link to={`/products/${productId}`}>
        <img
          width={100}
          height={100}
          src={"/static/productImages/" + product.productImages[0].url}
          alt={product.productImages[0].description}
        />
      </Link>
      <Text as={Link} to={`/products/${productId}`}>
        {product.name}
      </Text>
      <Text>{product.price}₽</Text>
      <form className={styles.quantityForm} onSubmit={preventDefault(() => {})}>
        <Button
          type="button"
          btnColor="overgrown"
          disabled={isUpdateBasketProductLoading}
          onClick={handleChangeQuantityBtnClick(false)}
        >
          -
        </Button>
        <Indent size={2} inline />
        <Input
          value={inputQuantity}
          onChange={handleInputChange}
          name="quantity"
          type="number"
          min={0}
          disabled={isUpdateBasketProductLoading}
        />
        <Indent size={2} inline />
        <Button
          type="button"
          btnColor="overgrown"
          disabled={isUpdateBasketProductLoading}
          onClick={handleChangeQuantityBtnClick(true)}
        >
          +
        </Button>
      </form>
      <Text>{quantity * product.price}₽</Text>
    </Card>
  );
});
