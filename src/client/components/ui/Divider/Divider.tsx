import type { CSSProperties } from "react";
import React from "react";
import type { TColor } from "../../types/TColor";
import type { InheritableElementProps } from "../../types/PolymorphicComponent";
import styles from "./divider.module.css";
import type { TTextSize } from "../../types/TTextSize";

interface IDividerProps {
  dividerColor?: TColor | string;
  dividerThickness?: 1 | 2 | 3 | 4;
  column?: boolean;
  dividerColumnHeight?: TTextSize | "100%";
}

type DividerProps = InheritableElementProps<"hr", IDividerProps>;

export const Divider = ({
  style,
  dividerColor = "black",
  dividerThickness = 1,
  className,
  column = false,
  dividerColumnHeight,
  ...other
}: DividerProps) => {
  const dividerStyles = {
    ...style,
    ["--divider-color"]: `var(--${dividerColor})`,
  } as CSSProperties;

  if (!column) {
    dividerStyles.height = dividerThickness;
    dividerStyles.marginBottom = dividerThickness * -1;
  } else {
    if (dividerColumnHeight === "100%") {
      dividerStyles.height = "100%";
    } else if (dividerColumnHeight !== undefined) {
      dividerStyles.height = `var(--font-size-${dividerColumnHeight})`;
    }
    dividerStyles.width = dividerThickness;
    dividerStyles.marginRight = dividerThickness * -1;
  }

  return (
    <hr
      className={[
        className,
        styles.divider,
        column ? styles.column : styles.row,
      ]
        .filter(Boolean)
        .join(" ")}
      style={dividerStyles}
      {...other}
    />
  );
};
