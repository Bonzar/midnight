import React from "react";
import type { TActiveColor } from "../../types/TColor";
import type { InheritableElementProps } from "../../types/PolymorphicComponent";
import buttonStyles from "./button.module.css";
import type { TextProps } from "../Text";
import { Text } from "../Text";
import type { ExtendableProps } from "../../types/PolymorphicComponent";

interface IButtonProps {
  color: TActiveColor;
}

type ButtonProps = ExtendableProps<
  TextProps<"button">,
  InheritableElementProps<"button", IButtonProps>
>;

export const Button = ({
  color,
  className,
  children,
  style,
  ...other
}: ButtonProps) => {
  const btnStyles = {
    ...style,
    [`--primary-color`]: `var(--${color})`,
    [`--secondary-color`]: `var(--${color}-light)`,
  } as React.CSSProperties;

  return (
    <Text
      as="button"
      className={buttonStyles.button}
      style={btnStyles}
      {...other}
    >
      {children}
    </Text>
  );
};
