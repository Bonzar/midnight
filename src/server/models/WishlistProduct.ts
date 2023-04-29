import { Optional } from "sequelize";
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
  id: number;
  wishlistId: number;
  productId: number;
}

interface WishlistProductCreationAttributes
  extends Optional<WishlistProductAttributes, "id"> {}

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
