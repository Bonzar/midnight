import type React from "react";

export type PolymorphicComponent<
  E extends React.ElementType,
  Props = {}
> = Props & Omit<React.ComponentPropsWithoutRef<E>, keyof Props> & { as?: E };
