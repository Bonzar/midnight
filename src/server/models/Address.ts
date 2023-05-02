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
import { User } from "./User";
import { exhaustiveModelCheck } from "./helpers";

interface AddressAttributes {
  id: Address["id"];
  country: Address["country"];
  city: Address["city"];
  street: Address["street"];
  house: Address["house"];
  flat: Address["flat"] | null;
  userId: Address["userId"];
}

export type AddressCreationAttributes = Optional<
  AddressAttributes,
  "id" | "flat"
>;

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
  @Column
  flat!: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}

exhaustiveModelCheck<AddressAttributes, Address>();
