import type { ReactNode } from "react";
import React from "react";
import styles from "./header.module.css";
import { Link, NavLink } from "react-router-dom";
import { LayoutContainer } from "../LayoutContainer";
import { Text } from "../../ui/Text";
import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/slices/userSlice";
import type { ListItemWithoutKey } from "../../ui/List";
import { List } from "../../ui/List";
import { Indent } from "../../ui/Indent";
import { intersperse, mergeLeft } from "ramda";

interface INavLinkTextProps {
  children: ReactNode;
}

const NavLinkText = ({ children }: INavLinkTextProps) => {
  return (
    <Text textColor="white" textSize={3} textWeight="semibold">
      {children}
    </Text>
  );
};

export function Header() {
  const { isAuth: isCurrentUserAuth } = useAppSelector(selectUser);

  const indent = {
    as: Indent,
    size: 3 as const,
    inline: true,
  };

  const links = [
    {
      to: "/",
      children: <NavLinkText>Главная</NavLinkText>,
    },
    {
      to: isCurrentUserAuth ? "/profile" : "/login",
      children: isCurrentUserAuth ? (
        <NavLinkText>Профиль</NavLinkText>
      ) : (
        <NavLinkText>Войти</NavLinkText>
      ),
    },
  ].map(mergeLeft({ as: NavLink }));

  const linksWithIndents = intersperse<
    ListItemWithoutKey<typeof NavLink> | ListItemWithoutKey<typeof Indent>
  >(indent, links);

  const linksWithKeys = linksWithIndents.map((item, index, array) => {
    const key =
      "to" in item
        ? item.to.toString()
        : (
            array[index - 1] as ListItemWithoutKey<typeof NavLink>
          ).to.toString() + "-indent";

    return { ...item, key };
  });

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
        <nav>
          <List list={linksWithKeys} />
        </nav>
      </LayoutContainer>
    </header>
  );
}
