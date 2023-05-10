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
import type { ModelKeys } from "../helpers/exhaustiveModelCheck";
import { keysCheck } from "../helpers/exhaustiveModelCheck";
import type { OrderCreationAttributes, OrderAttributes } from "./Order";
import { Order } from "./Order";
import type { ProductAttributes, ProductCreationAttributes } from "./Product";
import { Product } from "./Product";

interface OrderProductBaseAttributes {
  id: OrderProduct["id"];
  quantity: OrderProduct["quantity"];
  salePrice: OrderProduct["salePrice"];
  orderId: OrderProduct["orderId"];
  productId: OrderProduct["productId"];
}

interface OrderProductAssociationAttributes {
  order: OrderAttributes;
  product: ProductAttributes;
}

export type OrderProductCreationAttributes = Optional<
  Omit<OrderProductBaseAttributes, "id">,
  never
> & {
  order?: OrderCreationAttributes;
  product?: ProductCreationAttributes;
};

@Table
export class OrderProduct extends Model<
  OrderProductBaseAttributes,
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

export type OrderProductAttributes = OrderProductBaseAttributes &
  Partial<OrderProductAssociationAttributes>;

keysCheck<ModelKeys<OrderProduct>, keyof OrderProductAttributes>();
keysCheck<OrderProductAttributes, keyof ModelKeys<OrderProduct>>();
keysCheck<
  OrderProductCreationAttributes,
  keyof Omit<ModelKeys<OrderProduct>, "id">
>();
