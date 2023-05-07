import React from "react";
import type { ReactNode } from "react";
import styles from "./layout.module.css";
import { Content } from "./Content";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Text } from "../ui/Text";

interface ILayoutProps {
  children: ReactNode;
}

export function Layout({ children }: ILayoutProps) {
  return (
    <div className={styles.layout}>
      <Header />
      <Content>{children}</Content>
      <Footer>
        <Text>Happy Shop</Text>
      </Footer>
    </div>
  );
}
