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

interface IAddressAttributes {
  id: number;
  country: string;
  city: string;
  street: string;
  house: string;
  flat: number | null;
  userId: number;
}

interface IAddressCreationAttributes
  extends Optional<IAddressAttributes, "id" | "flat"> {}

@Table
export class Address extends Model<
  IAddressAttributes,
  IAddressCreationAttributes
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

exhaustiveModelCheck<IAddressAttributes, Address>();
