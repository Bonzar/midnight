import type { ReactNode } from "react";
import React from "react";
import styles from "./footer.module.css";
import { LayoutContainer } from "../LayoutContainer";

interface IFooterProps {
  children: ReactNode;
}

export function Footer({ children }: IFooterProps) {
  return (
    <footer className={styles.footer}>
      <LayoutContainer className={styles.footerContainer}>
        {children}
      </LayoutContainer>
    </footer>
  );
}
