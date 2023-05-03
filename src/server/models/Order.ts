import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Min,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import type { UserCreationAttributes } from "./User";
import { User } from "./User";
import type { OrderProductCreationAttributes } from "./OrderProduct";
import { OrderProduct } from "./OrderProduct";
import type { ProductCreationAttributes } from "./Product";
import { Product } from "./Product";
import type { CouponCreationAttributes } from "./Coupon";
import { Coupon } from "./Coupon";
import type { OrderCouponCreationAttributes } from "./OrderCoupon";
import { OrderCoupon } from "./OrderCoupon";
import type { ShipmentCreationAttributes } from "./Shipment";
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
  Omit<OrderAttributes, "id">,
  "isPaid" | "status" | "note" | "shipDate"
> & {
  user?: UserCreationAttributes;
  shipment?: ShipmentCreationAttributes;
  products?: Array<ProductCreationAttributes & OrderProductCreationAttributes>;
  coupons?: CouponCreationAttributes[];
  orderProducts?: Omit<OrderProductCreationAttributes, "orderId" | "order">[];
  orderCoupons?: Omit<OrderCouponCreationAttributes, "orderId" | "order">[];
};

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
  // calculate when order create
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

  @HasMany(() => OrderProduct)
  orderProducts!: OrderProduct[];

  @BelongsToMany(() => Coupon, () => OrderCoupon)
  coupons!: Array<Coupon & { OrderCoupon: OrderCoupon }>;

  @HasMany(() => OrderCoupon)
  orderCoupons!: OrderCoupon[];
}

exhaustiveModelCheck<OrderAttributes, Order>();
