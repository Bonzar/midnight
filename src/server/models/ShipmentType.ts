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
import { Order } from "./Order";

interface ShipmentTypeAttributes {
  id: number;
  name: string;
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
  @Column
  name!: string;

  @AllowNull(false)
  @Min(0)
  @Column
  price!: number;

  @HasMany(() => Order)
  orders!: Order[];
}

exhaustiveModelCheck<ShipmentTypeAttributes, ShipmentType>();
