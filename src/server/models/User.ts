import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  Default,
  HasMany,
  HasOne,
  IsEmail,
  Length,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { Address } from "./Address";
import { exhaustiveModelCheck } from "./helpers";
import { Basket } from "./Basket";
import { Order } from "./Order";
import { Wishlist } from "./Wishlist";

interface IUserAttributes {
  id: number;
  firstName: string;
  lastName: string | null;
  middleName: string | null;
  email: string;
  password: string;
  isVerified: boolean;
  role: "USER" | "ADMIN";
}

interface IUserCreationAttributes
  extends Optional<
    IUserAttributes,
    "id" | "isVerified" | "role" | "lastName" | "middleName"
  > {}

@Table
export class User extends Model<IUserAttributes, IUserCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  firstName!: string;

  @AllowNull(true)
  @NotEmpty
  @Column
  lastName!: string;

  @AllowNull(true)
  @NotEmpty
  @Column
  middleName!: string;

  @Unique
  @AllowNull(false)
  @IsEmail
  @Column
  email!: string;

  @AllowNull(false)
  @Length({ min: 8, max: 20 })
  @Column
  password!: string;

  @AllowNull(false)
  @Default(false)
  @Column
  isVerified!: boolean;

  @AllowNull(false)
  @Default("USER")
  @Column
  role!: "USER" | "ADMIN";

  @HasMany(() => Address)
  addresses!: Address[];

  @HasMany(() => Order)
  orders!: Order[];

  @HasOne(() => Basket)
  basket?: Basket;

  @HasOne(() => Wishlist)
  wishlist?: Wishlist;
}

exhaustiveModelCheck<IUserAttributes, User>();
