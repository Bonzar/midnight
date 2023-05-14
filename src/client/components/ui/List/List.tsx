import type { ElementType, ReactNode } from "react";
import React from "react";
import type { PolymorphicComponentProps } from "../../types/PolymorphicComponent";

interface IListItem {
  key: string | number;
  children?: ReactNode;
}

type ListItemProps<C extends ElementType = ElementType> =
  PolymorphicComponentProps<C, IListItem>;

interface IListProps {
  list: Array<ListItemProps>;
}

export const List = ({ list }: IListProps) => {
  return (
    <>
      {list.map(({ key, as, children, ...other }) => {
        const Component = as || "div";

        return (
          <Component key={key} {...other}>
            {children}
          </Component>
        );
      })}
    </>
  );
};

export type ListItem<C extends ElementType> = Omit<ListItemProps<C>, "as"> &
  Required<Pick<ListItemProps<C>, "as">>;
