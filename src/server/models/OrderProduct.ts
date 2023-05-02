import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  ForeignKey,
  Min,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import { Order } from "./Order";
import { Product } from "./Product";

interface OrderProductAttributes {
  id: OrderProduct["id"];
  quantity: OrderProduct["quantity"];
  salePrice: OrderProduct["salePrice"];
  orderId: OrderProduct["orderId"];
  productId: OrderProduct["productId"];
}

export type OrderProductCreationAttributes = Optional<
  OrderProductAttributes,
  "id"
>;

@Table
export class OrderProduct extends Model<
  OrderProductAttributes,
  OrderProductCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Min(1)
  @Column
  quantity!: number;

  @AllowNull(false)
  @Min(0)
  @Column
  salePrice!: number;

  @AllowNull(false)
  @ForeignKey(() => Order)
  @Column
  orderId!: number;

  @AllowNull(false)
  @ForeignKey(() => Product)
  @Column
  productId!: number;
}

exhaustiveModelCheck<OrderProductAttributes, OrderProduct>();
