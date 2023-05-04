import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import type { UserCreationAttributes } from "./User";
import { User } from "./User";
import type { ProductCreationAttributes } from "./Product";
import { Product } from "./Product";
import type { WishlistProductCreationAttributes } from "./WishlistProduct";
import { WishlistProduct } from "./WishlistProduct";

interface WishlistAttributes {
  id: Wishlist["id"];
  userId: Wishlist["userId"];
}

export type WishlistCreationAttributes = Optional<
  Omit<WishlistAttributes, "id">,
  never
> & {
  user?: Omit<UserCreationAttributes, "wishlist">;
  products?: ProductCreationAttributes[];
} & {
  wishlistProducts?: Omit<
    WishlistProductCreationAttributes,
    "wishlistId" | "wishlist"
  >[];
};

@Table
export class Wishlist extends Model<
  WishlistAttributes,
  WishlistCreationAttributes
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

  @HasMany(() => WishlistProduct)
  wishlistProducts!: WishlistProduct[];
}

exhaustiveModelCheck<WishlistAttributes, WishlistCreationAttributes, Wishlist>(
  true
);
