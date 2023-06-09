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
import type { ModelAttr } from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
import type { OrderAttributes, OrderCreationAttributes } from "./Order";
import { Order } from "./Order";
import type { CouponCreationAttributes, CouponAttributes } from "./Coupon";
import { Coupon } from "./Coupon";
import type { NotUndefined } from "../../../types/types";

export interface OrderCouponAttributes {
  id: OrderCoupon["id"];
  orderId: OrderCoupon["orderId"];
  couponId: OrderCoupon["couponId"];
}

interface OrderCouponAssociationsAttributes {
  order: OrderAttributes;
  coupon: CouponAttributes;
}

export type OrderCouponCreationAttributes = Optional<
  Omit<OrderCouponAttributes, "id">,
  never
>;

interface OrderCouponCreationAssociationsAttributes {
  order: OrderCreationAttributes;
  coupon: CouponCreationAttributes;
}

@Table
export class OrderCoupon extends Model<
  OrderCouponAttributes,
  OrderCouponCreationAttributes &
    Partial<OrderCouponCreationAssociationsAttributes>
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
  NotUndefined<ModelAttr<OrderCoupon>>,
  NotUndefined<OrderCouponAttributes>,
  NotUndefined<OrderCouponCreationAttributes>,
  NotUndefined<OrderCouponAssociationsAttributes>,
  NotUndefined<OrderCouponCreationAssociationsAttributes>
>();
