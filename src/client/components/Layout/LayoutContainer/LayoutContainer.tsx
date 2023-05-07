import type { ReactNode } from "react";
import React from "react";
import styles from "./layoutcontainer.module.css";

interface ILayoutContainerProps {
  children: ReactNode;
  className?: string;
}

export function LayoutContainer({
  children,
  className,
}: ILayoutContainerProps) {
  return (
    <div className={[styles.container, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
