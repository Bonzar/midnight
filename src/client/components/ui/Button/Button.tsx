import React from "react";
import type { TActiveColor } from "../../types/TColor";
import type {
  ExtendableProps,
  InheritableElementProps,
} from "../../types/PolymorphicComponent";
import buttonStyles from "./button.module.css";
import type { TextProps } from "../Text";
import { Text } from "../Text";

interface IButtonProps {
  btnColor: TActiveColor;
}

type ButtonProps = ExtendableProps<
  TextProps<"button">,
  InheritableElementProps<"button", IButtonProps>
>;

export const Button = ({
  btnColor,
  className,
  children,
  style,
  ...other
}: ButtonProps) => {
  const btnStyles = {
    ...style,
    [`--primary-color`]: `var(--${btnColor})`,
    [`--secondary-color`]: `var(--${btnColor}-light)`,
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
