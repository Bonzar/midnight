import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  HasMany,
  Min,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import { Shipment } from "./Shipment";

interface ShipmentTypeAttributes {
  id: number;
  code: string;
  price: number;
}

interface ShipmentTypeCreationAttributes
  extends Optional<ShipmentTypeAttributes, "id"> {}

@Table
export class ShipmentType extends Model<
  ShipmentTypeAttributes,
  ShipmentTypeCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @NotEmpty
  @Unique
  @Column({
    set: (value: ShipmentTypeAttributes["code"]) => value.toUpperCase(),
  })
  code!: string;

  @AllowNull(false)
  @Min(0)
  @Column
  price!: number;

  @HasMany(() => Shipment)
  shipments!: Shipment[];
}

exhaustiveModelCheck<ShipmentTypeAttributes, ShipmentType>();
