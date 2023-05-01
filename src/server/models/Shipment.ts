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
import { ShipmentType } from "./ShipmentType";

interface ShipmentAttributes {
  id: number;
  address: string | null;
  shipmentTypeId: number;
}

interface ShipmentCreationAttributes
  extends Optional<ShipmentAttributes, "id"> {}

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
  @Column
  address!: string;

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
