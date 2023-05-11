import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import type {
  ModelAttr,
  ModelAttributesWithSelectedAssociations,
} from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
import type {
  WishlistAttributes,
  WishlistCreationAttributes,
} from "./Wishlist";
import { Wishlist } from "./Wishlist";
import type { ProductCreationAttributes, ProductAttributes } from "./Product";
import { Product } from "./Product";
import type { NotUndefined } from "../../../types/types";

export interface WishlistProductAttributes {
  id: WishlistProduct["id"];
  wishlistId: WishlistProduct["wishlistId"];
  productId: WishlistProduct["productId"];
}

interface WishlistProductAssociationsAttributes {
  wishlist: WishlistAttributes;
  product: ProductAttributes;
}

export type WishlistProductCreationAttributes = Optional<
  Omit<WishlistProductAttributes, "id">,
  never
> & {
  wishlist?: WishlistCreationAttributes;
  product?: ProductCreationAttributes;
};

@Table
export class WishlistProduct extends Model<
  WishlistProductAttributes,
  WishlistProductCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => Wishlist)
  @Column
  wishlistId!: number;

  @BelongsTo(() => Wishlist)
  wishlist!: Wishlist;

  @AllowNull(false)
  @ForeignKey(() => Product)
  @Column
  productId!: number;

  @BelongsTo(() => Product)
  product!: Product;
}

export type WishlistProductAttributesWithAssociations<
  Associations extends keyof Omit<
    WishlistProductAssociationsAttributes,
    keyof NestedAssociate
  >,
  NestedAssociate extends Partial<WishlistProductAssociationsAttributes> = {}
> = ModelAttributesWithSelectedAssociations<
  WishlistProductAttributes,
  WishlistProductAssociationsAttributes,
  Associations,
  NestedAssociate
>;

exhaustiveModelCheck<
  NotUndefined<ModelAttr<WishlistProduct>>,
  NotUndefined<WishlistProductAttributes>,
  NotUndefined<WishlistProductCreationAttributes>,
  NotUndefined<WishlistProductAssociationsAttributes>
>();
