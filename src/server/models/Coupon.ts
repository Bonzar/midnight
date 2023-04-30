import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  Default,
  Min,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import { OrderCoupon } from "./OrderCoupon";
import { Order } from "./Order";

interface ICouponAttributes {
  id: number;
  key: string;
  value: number;
  type: "AMOUNT" | "PERCENTAGE";
  expiresTime: number | null;
  expiresCount: number | null;
}

interface ICouponCreationAttributes
  extends Optional<
    ICouponAttributes,
    "id" | "type" | "expiresTime" | "expiresCount"
  > {}

@Table
export class Coupon extends Model<
  ICouponAttributes,
  ICouponCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Unique
  @Column
  key!: string;

  @AllowNull(false)
  @Min(0)
  @Column
  value!: number;

  @AllowNull(false)
  @Default("PERCENTAGE")
  @Column
  type!: "AMOUNT" | "PERCENTAGE";

  @AllowNull(true)
  @Min(1672531200) // Sun Jan 01 2023 00:00:00 GMT+0000
  @Column
  expiresTime!: number;

  @AllowNull(true)
  @Min(1)
  @Column
  expiresCount!: number;

  @BelongsToMany(() => Order, () => OrderCoupon)
  orders!: Array<Order & { OrderCoupon: OrderCoupon }>;
}

exhaustiveModelCheck<ICouponAttributes, Coupon>();
