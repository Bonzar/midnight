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
import type { UserCreationAttributes, UserAttributes } from "./User";
import { User } from "./User";
import type { ProductCreationAttributes, ProductAttributes } from "./Product";
import { Product } from "./Product";
import type {
  BasketProductAttributes,
  BasketProductCreationAttributes,
} from "./BasketProduct";
import { BasketProduct } from "./BasketProduct";
import type { CouponAttributes, CouponCreationAttributes } from "./Coupon";
import { Coupon } from "./Coupon";
import type {
  BasketCouponAttributes,
  BasketCouponCreationAttributes,
} from "./BasketCoupon";
import { BasketCoupon } from "./BasketCoupon";

interface BasketBaseAttributes {
  id: Basket["id"];
  userId: Basket["userId"];
}

interface BasketAssociationsAttributes {
  user: UserAttributes;
  products: ProductAttributes[];
  basketProducts: BasketProductAttributes[];
  coupons: CouponAttributes[];
  basketCoupons: BasketCouponAttributes[];
}

export type BasketCreationAttributes = Optional<
  Omit<BasketBaseAttributes, "id">,
  never
> & {
  user?: Omit<UserCreationAttributes, "basket">;
  products?: ProductCreationAttributes[];
  basketProducts?: Omit<
    BasketProductCreationAttributes,
    "basketId" | "basket"
  >[];
  coupons?: CouponCreationAttributes[];
  basketCoupons?: Omit<BasketCouponCreationAttributes, "basketId" | "basket">[];
};

@Table
export class Basket extends Model<
  BasketBaseAttributes,
  BasketCreationAttributes
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

  @BelongsToMany(() => Product, () => BasketProduct)
  products!: Array<Product & { BasketProduct: BasketProduct }>;

  @HasMany(() => BasketProduct)
  basketProducts!: BasketProduct[];

  @BelongsToMany(() => Coupon, () => BasketCoupon)
  coupons!: Array<Coupon & { BasketCoupon: BasketCoupon }>;

  @HasMany(() => BasketCoupon)
  basketCoupons!: BasketCoupon[];
}

export type BasketAttributes = BasketBaseAttributes &
  Partial<BasketAssociationsAttributes>;

keysCheck<ModelKeys<Basket>, keyof BasketAttributes>();
keysCheck<BasketAttributes, keyof ModelKeys<Basket>>();
keysCheck<BasketCreationAttributes, keyof Omit<ModelKeys<Basket>, "id">>();
