import { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import { User } from "./User";
import { Product } from "./Product";
import { WishlistProduct } from "./WishlistProduct";

interface IWishlistAttributes {
  id: number;
  userId: number;
}

interface IWishlistCreationAttributes
  extends Optional<IWishlistAttributes, "id"> {}

@Table
export class Wishlist extends Model<
  IWishlistAttributes,
  IWishlistCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Unique
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsToMany(() => Product, () => WishlistProduct)
  products!: Array<Product & { WishlistProduct: WishlistProduct }>;
}

exhaustiveModelCheck<IWishlistAttributes, Wishlist>();
