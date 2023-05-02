import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import { Basket } from "./Basket";
import { Coupon } from "./Coupon";

interface BasketCouponAttributes {
  id: BasketCoupon["id"];
  basketId: BasketCoupon["basketId"];
  couponId: BasketCoupon["couponId"];
}

export type BasketCouponCreationAttributes = Optional<
  BasketCouponAttributes,
  "id"
>;

@Table
export class BasketCoupon extends Model<
  BasketCouponAttributes,
  BasketCouponCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => Basket)
  @Unique("BasketId_CouponId")
  @Column
  basketId!: number;

  @AllowNull(false)
  @ForeignKey(() => Coupon)
  @Unique("BasketId_CouponId")
  @Column
  couponId!: number;
}

exhaustiveModelCheck<BasketCouponAttributes, BasketCoupon>();
