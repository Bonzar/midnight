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
import type {
  ModelAttr,
  ModelAttributesWithSelectedAssociations,
} from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
import type { UserAttributes, UserCreationAttributes } from "./User";
import { User } from "./User";
import type {
  OrderProductAttributes,
  OrderProductCreationAttributes,
} from "./OrderProduct";
import { OrderProduct } from "./OrderProduct";
import type { ProductAttributes, ProductCreationAttributes } from "./Product";
import { Product } from "./Product";
import type { CouponAttributes, CouponCreationAttributes } from "./Coupon";
import { Coupon } from "./Coupon";
import type {
  OrderCouponCreationAttributes,
  OrderCouponAttributes,
} from "./OrderCoupon";
import { OrderCoupon } from "./OrderCoupon";
import type {
  ShipmentAttributes,
  ShipmentCreationAttributes,
} from "./Shipment";
import { Shipment } from "./Shipment";
import { DataTypes } from "sequelize";
import type { NotUndefined } from "../../../types/types";

interface OrderBaseAttributes {
  id: Order["id"];
  isPaid: Order["isPaid"];
  status: Order["status"];
  note: Order["note"];
  shipDate: Order["shipDate"];
  total: Order["total"];
  shipmentId: Order["shipmentId"];
  userId: Order["userId"];
}

interface OrderAssociationsAttributes {
  user: UserAttributes;
  shipment: ShipmentAttributes;
  products: Array<ProductAttributes & { OrderProduct: OrderProductAttributes }>;
  coupons: Array<CouponAttributes & { OrderCoupon: OrderCouponAttributes }>;
  orderProducts: OrderProductAttributes[];
  orderCoupons: OrderCouponAttributes[];
}

export type OrderCreationAttributes = Optional<
  Omit<OrderBaseAttributes, "id">,
  "isPaid" | "status" | "note" | "shipDate"
> & {
  user?: UserCreationAttributes;
  shipment?: ShipmentCreationAttributes;
  products?: ProductCreationAttributes[];
  coupons?: CouponCreationAttributes[];
  orderProducts?: Omit<OrderProductCreationAttributes, "orderId" | "order">[];
  orderCoupons?: Omit<OrderCouponCreationAttributes, "orderId" | "order">[];
};

@Table
export class Order extends Model<OrderBaseAttributes, OrderCreationAttributes> {
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
  total!: number; // calculating on order create

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

export type OrderAttributes = OrderBaseAttributes &
  Partial<OrderAssociationsAttributes>;

export type OrderAttributesWithAssociations<
  Associations extends keyof Omit<
    OrderAssociationsAttributes,
    keyof NestedAssociate
  >,
  NestedAssociate extends Partial<OrderAssociationsAttributes> = {}
> = ModelAttributesWithSelectedAssociations<
  OrderAttributes,
  OrderAssociationsAttributes,
  Associations,
  NestedAssociate
>;

exhaustiveModelCheck<
  NotUndefined<ModelAttr<Order>>,
  NotUndefined<OrderAttributes>,
  NotUndefined<OrderCreationAttributes>
>();
