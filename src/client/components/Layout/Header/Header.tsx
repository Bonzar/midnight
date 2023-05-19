import type { ReactNode } from "react";
import React from "react";
import styles from "./header.module.css";
import { Link, NavLink } from "react-router-dom";
import { LayoutContainer } from "../LayoutContainer";
import { Text } from "../../ui/Text";
import { useAppSelector } from "../../../store/helpers/hooks";
import { selectUser } from "../../../store/slices/userSlice";
import type { ListItem } from "../../ui/List";
import { List } from "../../ui/List";
import { Indent } from "../../ui/Indent";
import { intersperse, mergeLeft } from "ramda";
import { useGetBasketQuery } from "../../../store/slices/basketApiSlice";

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
  const { isAuth: isCurrentUserAuth, data: currentUserData } =
    useAppSelector(selectUser);

  const { data, error } = useGetBasketQuery();

  // use error instead of isError for not display prev success value until error disappear
  const basketProductsCount = error
    ? 0
    : data?.basket.basketProducts.reduce(
        (total, currentProduct) => total + currentProduct.quantity,
        0
      ) ?? 0;

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
      to:
        isCurrentUserAuth && currentUserData?.role !== "GUEST"
          ? "/profile"
          : "/login",
      children:
        isCurrentUserAuth && currentUserData?.role !== "GUEST" ? (
          <NavLinkText>Профиль</NavLinkText>
        ) : (
          <NavLinkText>Войти</NavLinkText>
        ),
    },
    {
      to: "/basket",
      children: <NavLinkText>Корзина ({basketProductsCount})</NavLinkText>,
    },
  ].map(mergeLeft({ as: NavLink }));

  const linksWithIndents = intersperse<
    Omit<ListItem<typeof NavLink>, "key"> | Omit<ListItem<typeof Indent>, "key">
  >(indent, links);

  const linksWithKeys = linksWithIndents.map((item, index, array) => {
    const key =
      "to" in item
        ? item.to.toString()
        : (array[index - 1] as ListItem<typeof NavLink>).to.toString() +
          "-indent";

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
