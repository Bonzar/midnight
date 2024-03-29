import React, { useEffect, useState } from "react";
import styles from "./basketProduct.module.css";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Indent } from "../../../components/ui/Indent";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import {
  useDeleteBasketProductMutation,
  useUpdateBasketProductMutation,
} from "../../../store/slices/basketApiSlice";
import { preventDefault } from "../../../utils/react/preventDefault";
import { parseAppInt } from "../../../../helpers/parseAppInt";
import { useDebouncedFunction } from "../../../hooks/useDebouncedFunction";
import { Link } from "react-router-dom";
import { useBasketProduct } from "../../../hooks/useBasketProduct";
import { Img } from "../../../components/ui/Img";

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

  const { basketProduct } = useBasketProduct(productId);

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
    if (newQuantity === 0) {
      return deleteBasketProduct({ productId });
    }

    return updateBasketProduct({ productId, quantity: newQuantity });
  };

  const debouncedQuantityUpdate = useDebouncedFunction(
    (newQuantity: number) => changeQuantity(newQuantity),
    500
  );

  const handleChangeQuantityBtnClick = (isAddOperand: boolean) => () => {
    let newQuantity = isAddOperand ? inputQuantity + 1 : inputQuantity - 1;
    if (newQuantity < 0) {
      newQuantity = 0;
    }

    setInputQuantity(newQuantity);
    debouncedQuantityUpdate(newQuantity);
  };

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
        <Img
          width={70}
          height={70}
          src={"/static/productImages/" + product.productImages.at(0)?.url}
          alt={product.productImages.at(0)?.description}
        />
      </Link>
      <Text as={Link} to={`/products/${productId}`}>
        {product.name}
      </Text>
      <Text className={styles.quantityFormPrice}>{product.price}₽</Text>
      <form className={styles.quantityForm} onSubmit={preventDefault(() => {})}>
        <Button
          className={styles.quantityFormButton}
          type="button"
          btnColor="overgrown"
          disabled={isUpdateBasketProductLoading}
          onClick={handleChangeQuantityBtnClick(false)}
        >
          -
        </Button>
        <Indent size={2} inline className={styles.quantityFormIndent} />
        <Input
          className={styles.quantityFormInput}
          value={inputQuantity}
          onChange={handleInputChange}
          name="quantity"
          type="number"
          inputMode="numeric"
          min={0}
          disabled={isUpdateBasketProductLoading}
        />
        <Indent size={2} inline className={styles.quantityFormIndent} />
        <Button
          className={styles.quantityFormButton}
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
