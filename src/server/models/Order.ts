import { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import { User } from "./User";
import { ShipmentType } from "./ShipmentType";
import { OrderProduct } from "./OrderProduct";
import { Product } from "./Product";
import { Coupon } from "./Coupon";
import { OrderCoupon } from "./OrderCoupon";

interface IOrderAttributes {
  id: number;
  isPaid: boolean;
  userId: number;
  shipmentTypeId: number;
}

interface IOrderCreationAttributes
  extends Optional<IOrderAttributes, "id" | "isPaid"> {}

@Table
export class Order extends Model<IOrderAttributes, IOrderCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Default(false)
  @Column
  isPaid!: boolean;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @AllowNull(false)
  @ForeignKey(() => ShipmentType)
  @Column
  shipmentTypeId!: number;

  @BelongsTo(() => ShipmentType)
  shipmentType!: ShipmentType;

  @BelongsToMany(() => Product, () => OrderProduct)
  products!: Array<Product & { OrderProduct: OrderProduct }>;

  @BelongsToMany(() => Coupon, () => OrderCoupon)
  coupons!: Array<Coupon & { OrderCoupon: OrderCoupon }>;
}

exhaustiveModelCheck<IOrderAttributes, Order>();
