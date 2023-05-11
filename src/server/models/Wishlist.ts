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
import type {
  ModelAttr,
  ModelAttributesWithSelectedAssociations,
} from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
import type { UserAttributes, UserCreationAttributes } from "./User";
import { User } from "./User";
import type { ProductCreationAttributes, ProductAttributes } from "./Product";
import { Product } from "./Product";
import type {
  WishlistProductAttributes,
  WishlistProductCreationAttributes,
} from "./WishlistProduct";
import { WishlistProduct } from "./WishlistProduct";
import type { NotUndefined } from "../../../types/types";

export interface WishlistAttributes {
  id: Wishlist["id"];
  userId: Wishlist["userId"];
}

interface WishlistAssociationsAttributes {
  user: UserAttributes;
  products: Array<
    ProductAttributes & { WishlistProduct: WishlistProductAttributes }
  >;
  wishlistProducts: WishlistProductAttributes[];
}

export type WishlistCreationAttributes = Optional<
  Omit<WishlistAttributes, "id">,
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

export type WishlistAttributesWithAssociations<
  Associations extends keyof Omit<
    WishlistAssociationsAttributes,
    keyof NestedAssociate
  >,
  NestedAssociate extends Partial<WishlistAssociationsAttributes> = {}
> = ModelAttributesWithSelectedAssociations<
  WishlistAttributes,
  WishlistAssociationsAttributes,
  Associations,
  NestedAssociate
>;

exhaustiveModelCheck<
  NotUndefined<ModelAttr<Wishlist>>,
  NotUndefined<WishlistAttributes>,
  NotUndefined<WishlistCreationAttributes>,
  NotUndefined<WishlistAssociationsAttributes>
>();
