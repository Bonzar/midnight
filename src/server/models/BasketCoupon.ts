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
import type {
  ModelAttr,
  ModelAttributesWithSelectedAssociations,
} from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
import type { BasketAttributes, BasketCreationAttributes } from "./Basket";
import { Basket } from "./Basket";
import type { CouponAttributes, CouponCreationAttributes } from "./Coupon";
import { Coupon } from "./Coupon";
import type { NotUndefined } from "../../../types/types";

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

export type BasketCouponAttributesWithAssociations<
  Associations extends keyof Omit<
    BasketCouponAssociationsAttributes,
    keyof NestedAssociate
  >,
  NestedAssociate extends Partial<BasketCouponAssociationsAttributes> = {}
> = ModelAttributesWithSelectedAssociations<
  BasketCouponAttributes,
  BasketCouponAssociationsAttributes,
  Associations,
  NestedAssociate
>;

exhaustiveModelCheck<
  NotUndefined<ModelAttr<BasketCoupon>>,
  NotUndefined<BasketCouponAttributes>,
  NotUndefined<BasketCouponCreationAttributes>
>();
