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
  Unique,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import type { BasketCreationAttributes } from "./Basket";
import { Basket } from "./Basket";
import type { CouponCreationAttributes } from "./Coupon";
import { Coupon } from "./Coupon";

interface BasketCouponAttributes {
  id: BasketCoupon["id"];
  basketId: BasketCoupon["basketId"];
  couponId: BasketCoupon["couponId"];
}

export type BasketCouponCreationAttributes = Optional<
  Omit<BasketCouponAttributes, "id">,
  never
> & {
  basket?: BasketCreationAttributes;
  coupon?: CouponCreationAttributes;
};

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

  @BelongsTo(() => Basket)
  basket!: Basket;

  @AllowNull(false)
  @ForeignKey(() => Coupon)
  @Unique("BasketId_CouponId")
  @Column
  couponId!: number;

  @BelongsTo(() => Coupon)
  coupon!: Coupon;
}

exhaustiveModelCheck<
  BasketCouponAttributes,
  BasketCouponCreationAttributes,
  BasketCoupon
>(true);
