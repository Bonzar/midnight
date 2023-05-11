import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Min,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import type { Optional } from "sequelize";
import type { UserAttributes, UserCreationAttributes } from "./User";
import { User } from "./User";
import type {
  ModelAttr,
  ModelAttributesWithSelectedAssociations,
} from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
import { DataTypes } from "sequelize";
import type { NotUndefined } from "../../../types/types";

export interface AddressAttributes {
  id: Address["id"];
  country: Address["country"];
  city: Address["city"];
  street: Address["street"];
  house: Address["house"];
  flat: Address["flat"];
  userId: Address["userId"];
}

interface AddressAssociationsAttributes {
  user: UserAttributes;
}

export type AddressCreationAttributes = Optional<
  Omit<AddressAttributes, "id">,
  "flat"
> & {
  user?: UserCreationAttributes;
};

@Table
export class Address extends Model<
  AddressAttributes,
  AddressCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  country!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  city!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  street!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  house!: string;

  @AllowNull(true)
  @Min(0)
  @Column(DataTypes.INTEGER)
  flat!: number | null;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}

export type AddressAttributesWithAssociations<
  Associations extends keyof Omit<
    AddressAssociationsAttributes,
    keyof NestedAssociate
  >,
  NestedAssociate extends Partial<AddressAssociationsAttributes> = {}
> = ModelAttributesWithSelectedAssociations<
  AddressAttributes,
  AddressAssociationsAttributes,
  Associations,
  NestedAssociate
>;

exhaustiveModelCheck<
  NotUndefined<ModelAttr<Address>>,
  NotUndefined<AddressAttributes>,
  NotUndefined<AddressCreationAttributes>,
  NotUndefined<AddressAssociationsAttributes>
>();
