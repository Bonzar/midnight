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

interface UserAttributes {
  id: User["id"];
  firstName: User["firstName"];
  lastName: User["lastName"] | null;
  middleName: User["middleName"] | null;
  email: User["email"];
  password: User["password"];
  isVerified: User["isVerified"];
  role: User["role"];
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "isVerified" | "role" | "lastName" | "middleName"
>;

@Table
export class User extends Model<UserAttributes, UserCreationAttributes> {
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

exhaustiveModelCheck<UserAttributes, User>();
