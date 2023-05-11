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
import type {
  ModelAttr,
  ModelAttributesWithSelectedAssociations,
} from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
import type {
  ShipmentAttributes,
  ShipmentCreationAttributes,
} from "./Shipment";
import { Shipment } from "./Shipment";
import type { NotUndefined } from "../../../types/types";

interface ShipmentTypeBaseAttributes {
  id: ShipmentType["id"];
  code: ShipmentType["code"];
  price: ShipmentType["price"];
}

interface ShipmentTypeAssociationsAttributes {
  shipments: ShipmentAttributes[];
}

export type ShipmentTypeCreationAttributes = Optional<
  Omit<ShipmentTypeBaseAttributes, "id">,
  never
> & {
  shipments?: Omit<
    ShipmentCreationAttributes,
    "shipmentTypeId" | "shipmentType"
  >[];
};

@Table
export class ShipmentType extends Model<
  ShipmentTypeBaseAttributes,
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
    set(value: ShipmentTypeBaseAttributes["code"]) {
      const currentInstance = <ShipmentType>this;
      currentInstance.setDataValue("code", value.toUpperCase());
    },
  })
  code!: string;

  @AllowNull(false)
  @Min(0)
  @Column
  price!: number;

  @HasMany(() => Shipment)
  shipments!: Shipment[];
}

export type ShipmentTypeAttributes = ShipmentTypeBaseAttributes &
  Partial<ShipmentTypeAssociationsAttributes>;

export type ShipmentTypeAttributesWithAssociations<
  Associations extends keyof Omit<
    ShipmentTypeAssociationsAttributes,
    keyof NestedAssociate
  >,
  NestedAssociate extends Partial<ShipmentTypeAssociationsAttributes> = {}
> = ModelAttributesWithSelectedAssociations<
  ShipmentTypeAttributes,
  ShipmentTypeAssociationsAttributes,
  Associations,
  NestedAssociate
>;

exhaustiveModelCheck<
  NotUndefined<ModelAttr<ShipmentType>>,
  NotUndefined<ShipmentTypeAttributes>,
  NotUndefined<ShipmentTypeCreationAttributes>
>();
