import type { ReactNode } from "react";
import React from "react";
import styles from "./card.module.css";
import type { InheritableElementProps } from "../../types/PolymorphicComponent";
import type { TActiveColor } from "../../types/TColor";
import { getClassName } from "../../../utils/react/getClassName";

interface ICardProps {
  children?: ReactNode;
  cardColor?: TActiveColor;
}

type CardProps = InheritableElementProps<"div", ICardProps>;

export const Card = ({ children, className, cardColor, style }: CardProps) => {
  const cardStyles = style ?? {};

  if (cardColor) {
    cardStyles.borderColor = `var(--${cardColor})`;
    cardStyles.backgroundColor = `var(--${cardColor}-light)`;
  }

  return (
    <div style={cardStyles} className={getClassName([styles.card, className])}>
      {children}
    </div>
  );
};
