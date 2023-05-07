import React from "react";
import styles from "./header.module.css";
import { NavLink } from "react-router-dom";
import { LayoutContainer } from "../LayoutContainer";
import { Text } from "../../ui/Text";
import { Indent } from "../../ui/Indent/Indent";

export function Header() {
  return (
    <header className={styles.header}>
      <LayoutContainer className={styles.headerContainer}>
        <div className={styles.logo}>
          <Text color="white" size={0} bold>
            Midnight
          </Text>
        </div>
        <nav>
          <Text as={NavLink} to="/" color="white" size={3} semibold>
            Главная
          </Text>
          <Indent inline size={3} />
          <Text as={NavLink} to="/products" color="white" size={3} semibold>
            Все товары
          </Text>
          <Indent inline size={3} />
          <Text as={NavLink} to="/basket" color="white" size={3} semibold>
            Корзина
          </Text>
        </nav>
      </LayoutContainer>
    </header>
  );
}
