import type { ElementType, PropsWithChildren } from "react";
import React from "react";
import styles from "./text.module.css";
import type { TColor } from "../../types/TColor";
import type { TTextSize } from "../../types/TTextSize";
import type { PolymorphicComponentProps } from "../../types/PolymorphicComponent";
import { parseAppInt } from "../../../../helpers/parseAppInt";
import { getClassName } from "../../../utils/react/getClassName";

interface ITextProps {
  textColor?: TColor;
  textSize?: TTextSize;
  textWeight?: "thick" | "regular" | "semibold" | "bold";
}

export type TextProps<E extends ElementType> = PropsWithChildren<
  PolymorphicComponentProps<E, ITextProps>
>;

export const Text = <E extends ElementType = "span">({
  as,
  children,
  textSize,
  textColor = "black",
  textWeight = "regular",
  className,
  ...other
}: TextProps<E>) => {
  const Component = as ?? "span";

  // default font size
  if (typeof textSize !== "number") {
    textSize = 4;
    // default heading font size
    if (
      typeof Component === "string" &&
      ["h1", "h2", "h3", "h4"].includes(Component)
    ) {
      textSize = parseAppInt(Component[1]) as 1 | 2 | 3 | 4;
    }
  }

  const classes = getClassName([
    className,
    styles.text,
    styles[`c-${textColor}`],
    styles[`s-${textSize}`],
    styles[`w-${textWeight}`],
  ]);

  return (
    <Component {...other} className={classes}>
      {children}
    </Component>
  );
};
