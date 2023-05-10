import React from "react";
import type { TextProps } from "../Text";
import { Text } from "../Text";

export const Label = (labelProps: TextProps<"label">) => {
  return <Text as="label" {...labelProps}></Text>;
};
