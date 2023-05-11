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
import type {
  ModelAttr,
  ModelAttributesWithSelectedAssociations,
} from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
import type { OrderCreationAttributes, OrderAttributes } from "./Order";
import { Order } from "./Order";
import type { ProductAttributes, ProductCreationAttributes } from "./Product";
import { Product } from "./Product";
import type { NotUndefined } from "../../../types/types";

export interface OrderProductAttributes {
  id: OrderProduct["id"];
  quantity: OrderProduct["quantity"];
  salePrice: OrderProduct["salePrice"];
  orderId: OrderProduct["orderId"];
  productId: OrderProduct["productId"];
}

interface OrderProductAssociationsAttributes {
  order: OrderAttributes;
  product: ProductAttributes;
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

export type OrderProductAttributesWithAssociations<
  Associations extends keyof Omit<
    OrderProductAssociationsAttributes,
    keyof NestedAssociate
  >,
  NestedAssociate extends Partial<OrderProductAssociationsAttributes> = {}
> = ModelAttributesWithSelectedAssociations<
  OrderProductAttributes,
  OrderProductAssociationsAttributes,
  Associations,
  NestedAssociate
>;

exhaustiveModelCheck<
  NotUndefined<ModelAttr<OrderProduct>>,
  NotUndefined<OrderProductAttributes>,
  NotUndefined<OrderProductCreationAttributes>,
  NotUndefined<OrderProductAssociationsAttributes>
>();
