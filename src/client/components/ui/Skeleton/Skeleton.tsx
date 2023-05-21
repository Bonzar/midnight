import type { ReactElement } from "react";
import React from "react";
import { useFlashTime } from "../../../hooks/useFlashTime";

interface ISkeletonProps {
  children: ReactElement;
}

export const Skeleton = ({ children }: ISkeletonProps) => {
  const isAwaitFlash = useFlashTime();

  if (isAwaitFlash) return null;

  return children;
};
