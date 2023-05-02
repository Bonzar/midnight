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
  Is,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import { OrderCoupon } from "./OrderCoupon";
import { Order } from "./Order";
import { DataTypes } from "sequelize";

interface CouponAttributes {
  id: Coupon["id"];
  key: Coupon["key"];
  value: Coupon["value"];
  type: Coupon["type"];
  expiresTime: Coupon["expiresTime"];
  expiresCount: Coupon["expiresCount"];
}

export type CouponCreationAttributes = Optional<
  CouponAttributes,
  "id" | "type" | "expiresTime" | "expiresCount"
>;

@Table
export class Coupon extends Model<CouponAttributes, CouponCreationAttributes> {
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
  @Is(
    "ExpiresTimeMoreThenNow",
    (value: CouponAttributes["expiresTime"]): void => {
      if (typeof value === "number" && value < Date.now()) {
        throw new Error(
          "Дата истечения промокода должна быть позже текущего момента"
        );
      }
    }
  )
  @Column(DataTypes.INTEGER)
  expiresTime!: number | null;

  @AllowNull(true)
  @Min(1)
  @Column(DataTypes.INTEGER)
  expiresCount!: number | null;

  @BelongsToMany(() => Order, () => OrderCoupon)
  orders!: Array<Order & { OrderCoupon: OrderCoupon }>;
}

exhaustiveModelCheck<CouponAttributes, Coupon>();
