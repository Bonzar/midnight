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
import type { ModelKeys } from "../helpers/exhaustiveModelCheck";
import { keysCheck } from "../helpers/exhaustiveModelCheck";
import type { BasketAttributes, BasketCreationAttributes } from "./Basket";
import { Basket } from "./Basket";
import type { CouponAttributes, CouponCreationAttributes } from "./Coupon";
import { Coupon } from "./Coupon";

interface BasketCouponBaseAttributes {
  id: BasketCoupon["id"];
  basketId: BasketCoupon["basketId"];
  couponId: BasketCoupon["couponId"];
}

interface BasketCouponAssociationsAttributes {
  basket: BasketAttributes;
  coupon: CouponAttributes;
}

export type BasketCouponCreationAttributes = Optional<
  Omit<BasketCouponBaseAttributes, "id">,
  never
> & {
  basket?: BasketCreationAttributes;
  coupon?: CouponCreationAttributes;
};

@Table
export class BasketCoupon extends Model<
  BasketCouponBaseAttributes,
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

export type BasketCouponAttributes = BasketCouponBaseAttributes &
  Partial<BasketCouponAssociationsAttributes>;

keysCheck<ModelKeys<BasketCoupon>, keyof BasketCouponAttributes>();
keysCheck<BasketCouponAttributes, keyof ModelKeys<BasketCoupon>>();
keysCheck<
  BasketCouponCreationAttributes,
  keyof Omit<ModelKeys<BasketCoupon>, "id">
>();
