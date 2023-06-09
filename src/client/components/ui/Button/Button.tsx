import React from "react";
import type { TActiveColor } from "../../types/TColor";
import type {
  ExtendableProps,
  InheritableElementProps,
} from "../../types/PolymorphicComponent";
import buttonStyles from "./button.module.css";
import type { TextProps } from "../Text";
import { Text } from "../Text";
import { getClassName } from "../../../utils/react/getClassName";

interface IButtonProps {
  btnColor: TActiveColor;
}

export type ButtonProps = ExtendableProps<
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
    [`--btn-primary-color`]: `var(--${btnColor})`,
    [`--btn-secondary-color`]: `var(--${btnColor}-light)`,
  } as React.CSSProperties;

  return (
    <Text
      as="button"
      className={getClassName([className, buttonStyles.button])}
      style={btnStyles}
      {...other}
    >
      {children}
    </Text>
  );
};
