import type { ReactNode } from "react";
import React from "react";
import styles from "./layoutcontainer.module.css";
import { getClassName } from "../../../utils/react/getClassName";

interface ILayoutContainerProps {
  children: ReactNode;
  className?: string;
}

export function LayoutContainer({
  children,
  className,
}: ILayoutContainerProps) {
  return (
    <div className={getClassName([styles.container, className])}>
      {children}
    </div>
  );
}
