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
  HasMany,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import type { OrderCouponCreationAttributes } from "./OrderCoupon";
import { OrderCoupon } from "./OrderCoupon";
import type { OrderCreationAttributes } from "./Order";
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
  Omit<CouponAttributes, "id">,
  "type" | "expiresTime" | "expiresCount"
> & {
  orders?: OrderCreationAttributes[];
  orderCoupons?: Omit<OrderCouponCreationAttributes, "couponId" | "coupon">[];
};

@Table
export class Coupon extends Model<CouponAttributes, CouponCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Unique
  @Column({
    set(value: CouponAttributes["key"]) {
      this.setDataValue("key", value.toUpperCase());
    },
  })
  key!: string;

  @AllowNull(false)
  @Min(0)
  @Is(function noMore100Percentage(value: CouponAttributes["value"]) {
    // @ts-ignore - Can't infer `this` type
    const currentInstance: Coupon = this;

    if (value > 100 && currentInstance.getDataValue("type") === "PERCENTAGE") {
      throw new Error("Скидка по промокоду не может быть больше 100%");
    }
  })
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

  @HasMany(() => OrderCoupon)
  orderCoupons!: OrderCoupon[];
}

exhaustiveModelCheck<CouponAttributes, Coupon>();
