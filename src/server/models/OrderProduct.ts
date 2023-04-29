import { Optional } from "sequelize";
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
  id: number;
  quantity: number;
  salePrice: number;
  orderId: number;
  productId: number;
}

interface OrderProductCreationAttributes
  extends Optional<OrderProductAttributes, "id"> {}

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
