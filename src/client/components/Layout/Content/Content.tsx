import type { ReactNode } from "react";
import React from "react";
import styles from "./content.module.css";
import { LayoutContainer } from "../LayoutContainer";

interface IContentProps {
  children: ReactNode;
}

export function Content({ children }: IContentProps) {
  return (
    <LayoutContainer className={styles.content}>{children}</LayoutContainer>
  );
}
