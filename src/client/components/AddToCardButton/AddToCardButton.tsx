import React from "react";
import styles from "./addToCardButton.module.css";
import { Button } from "../ui/Button";
import { preventDefault } from "../../utils/react/preventDefault";
import { stopPropagation } from "../../utils/react/stopPropagation";
import { Text } from "../ui/Text";
import { Indent } from "../ui/Indent";
import { Divider } from "../ui/Divider";
import { useAddBasketProductMutation } from "../../store/slices/basketApiSlice";

interface IAddToCardButtonProps {
  price: number;
  productId: number;
}

export const AddToCardButton = ({
  price,
  productId,
}: IAddToCardButtonProps) => {
  const [addToCart, addToCartData] = useAddBasketProductMutation();

  const handleAddToCart = () => {
    addToCart({ productId, quantity: 1 });
  };

  return (
    <Button
      className={styles.priceBlockBtn}
      btnColor="tunicGreen"
      onClick={preventDefault(stopPropagation(handleAddToCart))}
      disabled={addToCartData.isLoading}
    >
      <div className={styles.priceBlock}>
        <Text style={{ lineBreak: "loose" }}>В корзину</Text>
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
