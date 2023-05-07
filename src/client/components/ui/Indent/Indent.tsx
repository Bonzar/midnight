import React from "react";
import styles from "./indent.module.css";

type TIndentSize = 1 | 2 | 3 | 4 | 5 | 6;

type TIndentProps = {
  inline?: boolean;
  size: TIndentSize;
};

export const Indent = ({ inline = false, size }: TIndentProps) => {
  if (inline) {
    return <span className={styles[`i-${size}`]}></span>;
  }

  return <div className={styles[`b-${size}`]}></div>;
};
