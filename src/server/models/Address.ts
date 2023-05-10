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
import type { ModelKeys } from "../helpers/exhaustiveModelCheck";
import { keysCheck } from "../helpers/exhaustiveModelCheck";
import { DataTypes } from "sequelize";

interface AddressBaseAttributes {
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
  Omit<AddressBaseAttributes, "id">,
  "flat"
> & {
  user?: UserCreationAttributes;
};

@Table
export class Address extends Model<
  AddressBaseAttributes,
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

export type AddressAttributes = AddressBaseAttributes &
  Partial<AddressAssociationsAttributes>;

keysCheck<ModelKeys<Address>, keyof AddressAttributes>();
keysCheck<AddressAttributes, keyof ModelKeys<Address>>();
keysCheck<AddressCreationAttributes, keyof Omit<ModelKeys<Address>, "id">>();
