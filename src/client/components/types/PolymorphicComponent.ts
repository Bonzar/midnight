import type { ComponentPropsWithoutRef, ElementType } from "react";

/**
 * A more precise version of just React.ComponentPropsWithoutRef on its own
 *
 *  - Saved for use in case of problems with the usual `ComponentPropsWithoutRef`
 *
 */
// export type PropsOf<
//   C extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
// > = JSX.LibraryManagedAttributes<C, ComponentPropsWithoutRef<C>>;

type AsProp<C extends ElementType> = {
  /**
   * An override of the default HTML tag.
   * Can also be another React component.
   */
  as?: C;
};

/**
 * Allows for extending a set of props (`ExtendedProps`) by an overriding set of props
 * (`OverrideProps`), ensuring that any duplicates are overridden by the overriding
 * set of props.
 */
export type ExtendableProps<
  ExtendedProps = {},
  OverrideProps = {}
> = OverrideProps & Omit<ExtendedProps, keyof OverrideProps>;

/**
 * Allows for inheriting the props from the specified element type so that
 * props like children, className & style work, as well as element-specific
 * attributes like aria roles. The component (`C`) must be passed in.
 */
export type InheritableElementProps<
  C extends ElementType,
  Props = {}
> = ExtendableProps<ComponentPropsWithoutRef<C>, Props>;

/**
 * A more sophisticated version of `InheritableElementProps` where
 * the passed in `as` prop will determine which props can be included
 */
export type PolymorphicComponentProps<
  C extends ElementType,
  Props = {}
> = InheritableElementProps<C, Props & AsProp<C>>;
