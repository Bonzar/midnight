import React from "react";
import type { ElementType } from "react";
import styles from "./input.module.css";
import type { InheritableElementProps } from "../../types/PolymorphicComponent";
import type { TActiveColor } from "../../types/TColor";
import type { TextProps } from "../Text";
import { Text } from "../Text";
import type { ExtendableProps } from "../../types/PolymorphicComponent";

interface IInputProps {
  inputColor?: TActiveColor;
  inputFullWidth?: boolean;
  type?:
    | "datetime-local"
    | "month"
    | "number"
    | "email"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week"
    | "date"
    | "datetime";
}

type InputProps<E extends ElementType = "input"> = ExtendableProps<
  TextProps<E>,
  InheritableElementProps<E, IInputProps>
>;

export const Input = ({
  inputColor,
  inputFullWidth = true,
  className,
  style,
  type,
  ...other
}: InputProps) => {
  const classes = [
    className,
    styles.input,
    inputFullWidth && styles["w-fullwidth"],
  ]
    .filter(Boolean)
    .join(" ");

  const inputStyles = style ?? {};
  if (inputColor) {
    inputStyles.borderColor = `var(--${inputColor})`;
  }

  return (
    <Text
      as="input"
      type={type}
      className={classes}
      style={inputStyles}
      {...other}
    />
  );
};
