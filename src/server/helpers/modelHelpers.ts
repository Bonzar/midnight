import type { InferAttributes } from "sequelize";
import type { Model } from "sequelize-typescript";

type DefaultModelAttributes =
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "version";

export type ModelAttr<T extends Model> = Omit<
  InferAttributes<T>,
  DefaultModelAttributes
>;

// Saving from original object only key and field containing array or not
export type ModelCheckType<T> = {
  [k in keyof T]: T[k] extends Array<unknown> ? Array<unknown> : unknown;
};

// Check keys equals and fields containing array equals
export const exhaustiveModelCheck = <
  ModelAttr extends ModelCheckType<Attr> &
    ModelCheckType<AssocAttr> &
    ModelCheckType<CreationAttr> &
    ModelCheckType<CreationAssocAttr>,
  Attr extends Omit<ModelCheckType<ModelAttr>, keyof AssocAttr>,
  CreationAttr extends Omit<ModelCheckType<ModelAttr>, keyof AssocAttr | "id">,
  AssocAttr extends Omit<ModelCheckType<ModelAttr>, keyof Attr>,
  CreationAssocAttr extends Omit<
    ModelCheckType<ModelAttr>,
    keyof CreationAttr | "id"
  >
>() => {};

export type ModelAttributesWithSelectedAssociations<
  Attr extends object,
  AssociateAttr extends object,
  SelectAssociate extends keyof Omit<AssociateAttr, keyof NestedAssociate>,
  NestedAssociate extends Partial<AssociateAttr> = {}
> = Omit<Attr, keyof AssociateAttr> &
  Pick<AssociateAttr, SelectAssociate> &
  NestedAssociate;
