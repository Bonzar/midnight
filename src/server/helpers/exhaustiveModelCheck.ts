import type { Attributes, InferAttributes } from "sequelize";
import type { Model } from "sequelize-typescript";

type DefaultModelAttributes =
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "version";

type ModelInstanceKeys<T extends Model> = keyof Omit<
  InferAttributes<T>,
  DefaultModelAttributes
>;

export function exhaustiveModelCheck<
  ModelAttributes extends Attributes<any>,
  ModelAssociationsAttributes extends Attributes<any>,
  ModelInstance extends Model
>(
  value: ModelInstanceKeys<ModelInstance> extends
    | keyof ModelAttributes
    | keyof ModelAssociationsAttributes
    ?
        | keyof ModelAttributes
        | keyof ModelAssociationsAttributes extends ModelInstanceKeys<ModelInstance>
      ? true
      : never
    : never
) {
  return value;
}

export const keysCheck = <
  ModelAttributes,
  ModelInstance extends keyof ModelAttributes
>() => {};

export type ModelKeys<T extends Model> = Omit<
  InferAttributes<T>,
  DefaultModelAttributes
>;
