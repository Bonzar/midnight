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
import type { OrderAttributes, OrderCreationAttributes } from "./Order";
import { Order } from "./Order";
import type { CouponCreationAttributes, CouponAttributes } from "./Coupon";
import { Coupon } from "./Coupon";

interface OrderCouponBaseAttributes {
  id: OrderCoupon["id"];
  orderId: OrderCoupon["orderId"];
  couponId: OrderCoupon["couponId"];
}

interface OrderCouponAssociationAttributes {
  order: OrderAttributes;
  coupon: CouponAttributes;
}

export type OrderCouponCreationAttributes = Optional<
  Omit<OrderCouponBaseAttributes, "id">,
  never
> & {
  order?: OrderCreationAttributes;
  coupon?: CouponCreationAttributes;
};

@Table
export class OrderCoupon extends Model<
  OrderCouponBaseAttributes,
  OrderCouponCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => Order)
  @Unique("OrderId_CouponId")
  @Column
  orderId!: number;

  @BelongsTo(() => Order)
  order!: Order;

  @AllowNull(false)
  @ForeignKey(() => Coupon)
  @Unique("OrderId_CouponId")
  @Column
  couponId!: number;

  @BelongsTo(() => Coupon)
  coupon!: Coupon;
}

export type OrderCouponAttributes = OrderCouponBaseAttributes &
  Partial<OrderCouponAssociationAttributes>;

keysCheck<ModelKeys<OrderCoupon>, keyof OrderCouponAttributes>();
keysCheck<OrderCouponAttributes, keyof ModelKeys<OrderCoupon>>();
keysCheck<
  OrderCouponCreationAttributes,
  keyof Omit<ModelKeys<OrderCoupon>, "id">
>();
