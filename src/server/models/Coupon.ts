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
import type { ModelAttr } from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
import type {
  OrderCouponAttributes,
  OrderCouponCreationAttributes,
} from "./OrderCoupon";
import { OrderCoupon } from "./OrderCoupon";
import type { OrderAttributes, OrderCreationAttributes } from "./Order";
import { Order } from "./Order";
import { DataTypes } from "sequelize";
import type { NotUndefined } from "../../../types/types";

export interface CouponAttributes {
  id: Coupon["id"];
  key: Coupon["key"];
  value: Coupon["value"];
  type: Coupon["type"];
  expiresTime: Coupon["expiresTime"];
  expiresCount: Coupon["expiresCount"];
}

interface CouponAssociationsAttributes {
  orders: Array<OrderAttributes & { OrderCoupon: OrderCouponAttributes }>;
  orderCoupons: OrderCouponAttributes[];
}

export type CouponCreationAttributes = Optional<
  Omit<CouponAttributes, "id">,
  "type" | "expiresTime" | "expiresCount"
>;

interface CouponCreationAssociationsAttributes {
  orders: OrderCreationAttributes[];
  orderCoupons: Omit<OrderCouponCreationAttributes, "couponId" | "coupon">[];
}

@Table
export class Coupon extends Model<
  CouponAttributes,
  CouponCreationAttributes & Partial<CouponCreationAssociationsAttributes>
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Unique
  @Column({
    set(value: CouponAttributes["key"]) {
      const currentInstance = <Coupon>this;
      currentInstance.setDataValue("key", value.toUpperCase());
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
  @Column({ type: DataTypes.ENUM, values: ["AMOUNT", "PERCENTAGE"] })
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

exhaustiveModelCheck<
  NotUndefined<ModelAttr<Coupon>>,
  NotUndefined<CouponAttributes>,
  NotUndefined<CouponCreationAttributes>,
  NotUndefined<CouponAssociationsAttributes>,
  NotUndefined<CouponCreationAssociationsAttributes>
>();
