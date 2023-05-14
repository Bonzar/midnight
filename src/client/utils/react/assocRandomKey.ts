import { nanoid } from "@reduxjs/toolkit"; // non secure random id
import { assoc } from "ramda";

export const assocRandomKey = <O extends Record<string, unknown>>(obj: O) =>
  assoc("key", nanoid(), obj);
