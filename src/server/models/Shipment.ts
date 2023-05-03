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
import { exhaustiveModelCheck } from "./helpers";
import { Order } from "./Order";
import type { ShipmentTypeCreationAttributes } from "./ShipmentType";
import { ShipmentType } from "./ShipmentType";
import { DataTypes } from "sequelize";

interface ShipmentAttributes {
  id: Shipment["id"];
  address: Shipment["address"];
  shipmentTypeId: Shipment["shipmentTypeId"];
}

export type ShipmentCreationAttributes = Optional<
  Omit<ShipmentAttributes, "id">,
  never
> & {
  shipmentType?: ShipmentTypeCreationAttributes;
};

@Table
export class Shipment extends Model<
  ShipmentAttributes,
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

exhaustiveModelCheck<ShipmentAttributes, Shipment>();
