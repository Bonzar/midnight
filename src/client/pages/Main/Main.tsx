import React from "react";
import styles from "./main.module.css";
import { Text } from "../../components/ui/Text";

export const Main = () => {
  return (
    <Text as="div" textSize={0} className={styles.main}>
      Main
    </Text>
  );
};
