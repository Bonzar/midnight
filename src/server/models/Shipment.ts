import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasOne,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import type { ModelKeys } from "../helpers/exhaustiveModelCheck";
import { keysCheck } from "../helpers/exhaustiveModelCheck";
import type { OrderAttributes, OrderCreationAttributes } from "./Order";
import { Order } from "./Order";
import type {
  ShipmentTypeAttributes,
  ShipmentTypeCreationAttributes,
} from "./ShipmentType";
import { ShipmentType } from "./ShipmentType";
import { DataTypes } from "sequelize";

interface ShipmentBaseAttributes {
  id: Shipment["id"];
  address: Shipment["address"];
  shipmentTypeId: Shipment["shipmentTypeId"];
}

interface ShipmentAssociationsAttributes {
  order: OrderAttributes;
  shipmentType: ShipmentTypeAttributes;
}

export type ShipmentCreationAttributes = Optional<
  Omit<ShipmentBaseAttributes, "id">,
  "address"
> & {
  order?: Omit<OrderCreationAttributes, "shipmentId" | "shipment">;
  shipmentType?: ShipmentTypeCreationAttributes;
};

@Table
export class Shipment extends Model<
  ShipmentBaseAttributes,
  ShipmentCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataTypes.STRING)
  address!: string | null;

  @HasOne(() => Order)
  order?: Order;

  @AllowNull(false)
  @ForeignKey(() => ShipmentType)
  @Column
  shipmentTypeId!: number;

  @BelongsTo(() => ShipmentType)
  shipmentType!: ShipmentType;
}

export type ShipmentAttributes = ShipmentBaseAttributes &
  Partial<ShipmentAssociationsAttributes>;

keysCheck<ModelKeys<Shipment>, keyof ShipmentAttributes>();
keysCheck<ShipmentAttributes, keyof ModelKeys<Shipment>>();
keysCheck<ShipmentCreationAttributes, keyof Omit<ModelKeys<Shipment>, "id">>();
