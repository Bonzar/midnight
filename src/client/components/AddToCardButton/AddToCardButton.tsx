import React from "react";
import styles from "./addToCardButton.module.css";
import { Button } from "../ui/Button";
import { preventDefault } from "../../utils/react/preventDefault";
import { stopPropagation } from "../../utils/react/stopPropagation";
import { Text } from "../ui/Text";
import { Indent } from "../ui/Indent";
import { Divider } from "../ui/Divider";

interface IAddToCardButtonProps {
  price: number;
}

export const AddToCardButton = ({ price }: IAddToCardButtonProps) => {
  return (
    <Button
      className={styles.priceBlockBtn}
      btnColor="tunicGreen"
      onClick={preventDefault(stopPropagation(() => {}))}
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
