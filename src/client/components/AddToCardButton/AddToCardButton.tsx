import React from "react";
import styles from "./addToCardButton.module.css";
import type { ButtonProps } from "../ui/Button";
import { Button } from "../ui/Button";
import { preventDefault } from "../../utils/react/preventDefault";
import { stopPropagation } from "../../utils/react/stopPropagation";
import { Text } from "../ui/Text";
import { Indent } from "../ui/Indent";
import { Divider } from "../ui/Divider";
import { useAddBasketProductMutation } from "../../store/slices/basketApiSlice";
import type { ExtendableProps } from "../types/PolymorphicComponent";
import { useBasketProduct } from "../../hooks/useBasketProduct";

interface IAddToCardButtonProps {
  price: number;
  productId: number;
  stock: number;
}

type AddToCardButtonProps = ExtendableProps<
  Omit<ButtonProps, "btnColor" | "onClick" | "className">,
  IAddToCardButtonProps
>;

export const AddToCardButton = ({
  price,
  productId,
  stock,
  ...otherBtnProps
}: AddToCardButtonProps) => {
  const [addToCart, addToCartData] = useAddBasketProductMutation();

  const handleAddToCart = () => {
    addToCart({ productId, quantity: 1 });
  };

  const { basketProduct } = useBasketProduct(productId);

  let buttonText = stock > 0 ? "В корзину" : "Нет в наличии";
  if (basketProduct && basketProduct.quantity > 0) {
    buttonText = `В корзине (${basketProduct.quantity})`;
  }

  return (
    <Button
      className={styles.priceBlockBtn}
      btnColor="tunicGreen"
      onClick={preventDefault(stopPropagation(handleAddToCart))}
      disabled={
        addToCartData.isLoading || (basketProduct?.quantity ?? 0) >= stock
      }
      {...otherBtnProps}
    >
      <div className={styles.priceBlock}>
        <Text style={{ lineBreak: "loose" }}>{buttonText}</Text>
        <Indent size={3} inline />
        <Divider
          className={styles.divider}
          column
          dividerColumnHeight={4}
          dividerColor="btn-primary-color"
        />
        <Indent size={3} inline />
        <Text>{price}₽</Text>
      </div>
    </Button>
  );
};
