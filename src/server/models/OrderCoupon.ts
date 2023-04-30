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
import { Order } from "./Order";
import { Coupon } from "./Coupon";

interface OrderCouponAttributes {
  id: number;
  orderId: number;
  couponId: number;
}

interface OrderCouponCreationAttributes
  extends Optional<OrderCouponAttributes, "id"> {}

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

  @AllowNull(false)
  @ForeignKey(() => Coupon)
  @Unique("OrderId_CouponId")
  @Column
  couponId!: number;
}

exhaustiveModelCheck<OrderCouponAttributes, OrderCoupon>();
