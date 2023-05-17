import React from "react";
import { Text } from "../../components/ui/Text";
import styles from "./notMatching.module.css";

export const NotMatching = () => {
  return (
    <>
      <Text as="div" className={styles.status}>
        404
      </Text>
      <Text as="div" textSize={0} className={styles.messageText}>
        Страница не найдена
      </Text>
    </>
  );
};
