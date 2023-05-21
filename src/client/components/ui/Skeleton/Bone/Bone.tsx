import type { CSSProperties, ReactNode } from "react";
import React from "react";
import styles from "./bone.module.css";

type IBoneProps = {
  children?: ReactNode;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  aspectRatio?: CSSProperties["aspectRatio"];
};

export const Bone = ({
  children,
  aspectRatio,
  height = "100%",
  width = "100%",
}: IBoneProps) => {
  return (
    <div className={styles.bone} style={{ aspectRatio, height, width }}>
      {children}
    </div>
  );
};
