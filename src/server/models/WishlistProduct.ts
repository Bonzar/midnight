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
import type { ModelKeys } from "../helpers/exhaustiveModelCheck";
import { keysCheck } from "../helpers/exhaustiveModelCheck";
import type {
  WishlistAttributes,
  WishlistCreationAttributes,
} from "./Wishlist";
import { Wishlist } from "./Wishlist";
import type { ProductCreationAttributes, ProductAttributes } from "./Product";
import { Product } from "./Product";

interface WishlistProductBaseAttributes {
  id: WishlistProduct["id"];
  wishlistId: WishlistProduct["wishlistId"];
  productId: WishlistProduct["productId"];
}

interface WishlistProductAssociationsAttributes {
  wishlist: WishlistAttributes;
  product: ProductAttributes;
}

export type WishlistProductCreationAttributes = Optional<
  Omit<WishlistProductBaseAttributes, "id">,
  never
> & {
  wishlist?: WishlistCreationAttributes;
  product?: ProductCreationAttributes;
};

@Table
export class WishlistProduct extends Model<
  WishlistProductBaseAttributes,
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

export type WishlistProductAttributes = WishlistProductBaseAttributes &
  Partial<WishlistProductAssociationsAttributes>;

keysCheck<ModelKeys<WishlistProduct>, keyof WishlistProductAttributes>();
keysCheck<WishlistProductAttributes, keyof ModelKeys<WishlistProduct>>();
keysCheck<
  WishlistProductCreationAttributes,
  keyof Omit<ModelKeys<WishlistProduct>, "id">
>();
