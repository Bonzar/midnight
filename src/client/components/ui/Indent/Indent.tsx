import React from "react";

type TIndentSize = 1 | 2 | 3 | 4 | 5 | 6;

type TIndentProps = {
  size: TIndentSize;
  inline?: boolean;
  className?: string;
};

export const Indent = ({ inline = false, size, className }: TIndentProps) => {
  const Component = inline ? "span" : "div";
  const paddingDirection = inline ? "paddingLeft" : "paddingTop";

  const style: React.CSSProperties = {
    [paddingDirection]: `var(--indent-${size})`,
  };

  return <Component style={style} className={className}></Component>;
};
