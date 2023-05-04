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
import { exhaustiveModelCheck } from "../helpers/exhaustiveModelCheck";
import type { WishlistCreationAttributes } from "./Wishlist";
import { Wishlist } from "./Wishlist";
import type { ProductCreationAttributes } from "./Product";
import { Product } from "./Product";

interface WishlistProductAttributes {
  id: WishlistProduct["id"];
  wishlistId: WishlistProduct["wishlistId"];
  productId: WishlistProduct["productId"];
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

exhaustiveModelCheck<
  WishlistProductAttributes,
  WishlistProductCreationAttributes,
  WishlistProduct
>(true);
