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
import type { OrderCreationAttributes } from "./Order";
import { Order } from "./Order";
import type { CouponCreationAttributes } from "./Coupon";
import { Coupon } from "./Coupon";

interface OrderCouponAttributes {
  id: OrderCoupon["id"];
  orderId: OrderCoupon["orderId"];
  couponId: OrderCoupon["couponId"];
}

export type OrderCouponCreationAttributes = Optional<
  Omit<OrderCouponAttributes, "id">,
  never
> & {
  order?: OrderCreationAttributes;
  coupon?: CouponCreationAttributes;
};

@Table
export class OrderCoupon extends Model<
  OrderCouponAttributes,
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

exhaustiveModelCheck<
  OrderCouponAttributes,
  OrderCouponCreationAttributes,
  OrderCoupon
>(true);
