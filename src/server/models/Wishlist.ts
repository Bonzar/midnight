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
import type { ModelKeys } from "../helpers/exhaustiveModelCheck";
import { keysCheck } from "../helpers/exhaustiveModelCheck";
import type { UserAttributes, UserCreationAttributes } from "./User";
import { User } from "./User";
import type { ProductCreationAttributes, ProductAttributes } from "./Product";
import { Product } from "./Product";
import type {
  WishlistProductAttributes,
  WishlistProductCreationAttributes,
} from "./WishlistProduct";
import { WishlistProduct } from "./WishlistProduct";

export interface WishlistBaseAttributes {
  id: Wishlist["id"];
  userId: Wishlist["userId"];
}

interface WishlistAssociationsAttributes {
  user: UserAttributes;
  products: ProductAttributes[];
  wishlistProducts: WishlistProductAttributes[];
}

export type WishlistCreationAttributes = Optional<
  Omit<WishlistBaseAttributes, "id">,
  never
> & {
  user?: Omit<UserCreationAttributes, "wishlist">;
  products?: ProductCreationAttributes[];
  wishlistProducts?: Omit<
    WishlistProductCreationAttributes,
    "wishlistId" | "wishlist"
  >[];
};

@Table
export class Wishlist extends Model<
  WishlistBaseAttributes,
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

export type WishlistAttributes = WishlistBaseAttributes &
  Partial<WishlistAssociationsAttributes>;

keysCheck<ModelKeys<Wishlist>, keyof WishlistAttributes>();
keysCheck<WishlistAttributes, keyof ModelKeys<Wishlist>>();
keysCheck<WishlistCreationAttributes, keyof Omit<ModelKeys<Wishlist>, "id">>();
