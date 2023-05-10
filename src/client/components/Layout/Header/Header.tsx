import React from "react";
import styles from "./header.module.css";
import { Link, NavLink } from "react-router-dom";
import { LayoutContainer } from "../LayoutContainer";
import { Text } from "../../ui/Text";

export function Header() {
  return (
    <header className={styles.header}>
      <LayoutContainer className={styles.headerContainer}>
        <div className={styles.logo}>
          <Text
            as={Link}
            to="/"
            textColor="white"
            textSize={0}
            textWeight="thick"
          >
            Midnight
          </Text>
        </div>
        <Text as="a" href="/" target="_blank"></Text>
        <nav>
          <Text
            as={NavLink}
            to="/"
            textColor="white"
            textSize={3}
            textWeight="semibold"
          >
            Главная
          </Text>
        </nav>
      </LayoutContainer>
    </header>
  );
}
