import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import { Wishlist } from "./Wishlist";
import { Product } from "./Product";

interface WishlistProductAttributes {
  id: WishlistProduct["id"];
  wishlistId: WishlistProduct["wishlistId"];
  productId: WishlistProduct["productId"];
}

export type WishlistProductCreationAttributes = Optional<
  Omit<WishlistProductAttributes, "id">,
  never
>;

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

  @AllowNull(false)
  @ForeignKey(() => Product)
  @Column
  productId!: number;
}

exhaustiveModelCheck<WishlistProductAttributes, WishlistProduct>();
