import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Min,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import type { OrderCreationAttributes } from "./Order";
import { Order } from "./Order";
import type { ProductCreationAttributes } from "./Product";
import { Product } from "./Product";

interface OrderProductAttributes {
  id: OrderProduct["id"];
  quantity: OrderProduct["quantity"];
  salePrice: OrderProduct["salePrice"];
  orderId: OrderProduct["orderId"];
  productId: OrderProduct["productId"];
}

export type OrderProductCreationAttributes = Optional<
  Omit<OrderProductAttributes, "id">,
  never
> & {
  order?: OrderCreationAttributes;
  product?: ProductCreationAttributes;
};

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
  // saving on order create
  salePrice!: number;

  @AllowNull(false)
  @ForeignKey(() => Order)
  @Column
  orderId!: number;

  @BelongsTo(() => Order)
  order!: Order;

  @AllowNull(false)
  @ForeignKey(() => Product)
  @Column
  productId!: number;

  @BelongsTo(() => Product)
  product!: Product;
}

exhaustiveModelCheck<OrderProductAttributes, OrderProduct>();
