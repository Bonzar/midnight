import { has } from "ramda";

type TypeofTypes =
  | "undefined"
  | "object"
  | "boolean"
  | "number"
  | "bigint"
  | "string"
  | "symbol"
  | "function";

const isHasPropType = (prop: string, type: TypeofTypes, obj: unknown) =>
  has(prop, obj) && typeof obj[prop] === type;

export const isObjHasPropType =
  (obj: unknown) => (prop: string, type: TypeofTypes) =>
    isHasPropType(prop, type, obj);
