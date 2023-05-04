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
import { exhaustiveModelCheck } from "../helpers/exhaustiveModelCheck";
import type { UserCreationAttributes } from "./User";
import { User } from "./User";
import type { ProductCreationAttributes } from "./Product";
import { Product } from "./Product";
import type { BasketProductCreationAttributes } from "./BasketProduct";
import { BasketProduct } from "./BasketProduct";
import type { CouponCreationAttributes } from "./Coupon";
import { Coupon } from "./Coupon";
import type { BasketCouponCreationAttributes } from "./BasketCoupon";
import { BasketCoupon } from "./BasketCoupon";

interface BasketAttributes {
  id: Basket["id"];
  userId: Basket["userId"];
}

export type BasketCreationAttributes = Optional<
  Omit<BasketAttributes, "id">,
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
export class Basket extends Model<BasketAttributes, BasketCreationAttributes> {
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
  coupons!: Array<Basket & { BasketCoupon: BasketCoupon }>;

  @HasMany(() => BasketCoupon)
  basketCoupons!: BasketCoupon[];
}

exhaustiveModelCheck<BasketAttributes, BasketCreationAttributes, Basket>(true);
