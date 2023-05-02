import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  Default,
  ForeignKey,
  Min,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import { User } from "./User";
import { OrderProduct } from "./OrderProduct";
import { Product } from "./Product";
import { Coupon } from "./Coupon";
import { OrderCoupon } from "./OrderCoupon";
import { Shipment } from "./Shipment";
import { DataTypes } from "sequelize";

export interface OrderAttributes {
  id: Order["id"];
  isPaid: Order["isPaid"];
  status: Order["status"];
  note: Order["note"];
  shipDate: Order["shipDate"];
  total: Order["total"];
  userId: Order["userId"];
}

export type OrderCreationAttributes = Optional<
  OrderAttributes,
  "id" | "isPaid" | "status"
>;

@Table
export class Order extends Model<OrderAttributes, OrderCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Default(false)
  @Column
  isPaid!: boolean;

  @AllowNull(false)
  @Default("NEW")
  @Column
  status!: "NEW" | "COLLECT" | "SHIP" | "COMPLETE";

  @AllowNull(true)
  @Column(DataTypes.STRING)
  note!: string | null;

  @AllowNull(true)
  @Column(DataTypes.DATE)
  shipDate!: Date | null;

  @AllowNull(false)
  @Min(0)
  @Column
  total!: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @AllowNull(false)
  @ForeignKey(() => Shipment)
  @Column
  shipmentId!: number;

  @BelongsTo(() => Shipment)
  shipment!: Shipment;

  @BelongsToMany(() => Product, () => OrderProduct)
  products!: Array<Product & { OrderProduct: OrderProduct }>;

  @BelongsToMany(() => Coupon, () => OrderCoupon)
  coupons!: Array<Coupon & { OrderCoupon: OrderCoupon }>;
}

exhaustiveModelCheck<OrderAttributes, Order>();
