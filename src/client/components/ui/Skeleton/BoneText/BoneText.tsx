import type { CSSProperties } from "react";
import React from "react";
import styles from "./boneText.module.css";
import type { TTextSize } from "../../../types/TTextSize";
import { Bone } from "../Bone";
import { exhaustiveCheck } from "../../../../../helpers/exhaustiveCheck";

interface IBoneTextProps {
  size?: TTextSize;
}

export const BoneText = ({ size = 4 }: IBoneTextProps) => {
  let headerWidth: number | null;
  switch (size) {
    case 0:
      headerWidth = 50;
      break;
    case 1:
      headerWidth = 60;
      break;
    case 2:
      headerWidth = 70;
      break;
    case 3:
      headerWidth = 80;
      break;
    case 4:
      headerWidth = null;
      break;
    case 5:
      headerWidth = 90;
      break;
    default:
      exhaustiveCheck(size);
      headerWidth = null;
  }

  const boneTextStyles = {
    paddingBlock: `calc((var(--font-height-${size}) - var(--font-size-${size}))/2)`,
    height: `var(--font-height-${size})`,
  } as CSSProperties;

  if (headerWidth) {
    boneTextStyles.width = `${headerWidth}%`;
  }

  return (
    <div className={styles.boneText} style={boneTextStyles}>
      <Bone />
    </div>
  );
};
