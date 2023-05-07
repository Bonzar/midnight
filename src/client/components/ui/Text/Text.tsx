import React from "react";
import styles from "./text.module.css";
import type { ReactNode } from "react";
import type { TColor } from "../../types/TColor";
import type { PolymorphicComponent } from "../../types/PolymorphicComponent";

interface ITextProps {
  children?: ReactNode;
  color?: TColor;
  size?: 0 | 1 | 2 | 3 | 4 | 5;
  semibold?: boolean;
  bold?: boolean;
}

type TextProps<E extends React.ElementType> = PolymorphicComponent<
  E,
  ITextProps
>;

export const Text = <E extends React.ElementType = "span">({
  as,
  children,
  color = "black",
  size,
  semibold,
  bold,
  className,
  ...other
}: TextProps<E>) => {
  const Component = as || "span";

  // default font size
  if (typeof size !== "number") {
    size = 4;
    // default heading font size
    if (
      typeof Component === "string" &&
      ["h1", "h2", "h3", "h4"].includes(Component)
    ) {
      size = parseInt(Component[1]) as 1 | 2 | 3 | 4;
    }
  }

  const classes = [
    className,
    styles.text,
    styles[`c-${color}`],
    styles[`s-${size}`],
    semibold && styles["w-semibold"],
    bold && styles["w-bold"],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component {...other} className={classes}>
      {children}
    </Component>
  );
};
