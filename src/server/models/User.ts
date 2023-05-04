import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  Default,
  HasMany,
  HasOne,
  IsEmail,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "../helpers/exhaustiveModelCheck";
import { Address } from "./Address";
import type { AddressCreationAttributes } from "./Address";
import { Basket } from "./Basket";
import type { BasketCreationAttributes } from "./Basket";
import { Order } from "./Order";
import type { OrderCreationAttributes } from "./Order";
import { Wishlist } from "./Wishlist";
import type { WishlistCreationAttributes } from "./Wishlist";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

interface UserAttributes {
  id: User["id"];
  firstName: User["firstName"];
  lastName: User["lastName"];
  middleName: User["middleName"];
  email: User["email"];
  password: User["password"];
  isVerified: User["isVerified"];
  role: User["role"];
}

export type UserCreationAttributes = Optional<
  Omit<UserAttributes, "id">,
  "isVerified" | "role" | "lastName" | "middleName"
> & {
  basket?: Omit<BasketCreationAttributes, "userId" | "user">;
  wishlist?: Omit<WishlistCreationAttributes, "userId" | "user">;
  orders?: Omit<OrderCreationAttributes, "userId" | "user">[];
  addresses?: Omit<AddressCreationAttributes, "userId" | "user">[];
};

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
  @Column(DataTypes.STRING)
  lastName!: string | null;

  @AllowNull(true)
  @NotEmpty
  @Column(DataTypes.STRING)
  middleName!: string | null;

  @Unique
  @AllowNull(false)
  @IsEmail
  @Column
  email!: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    set(value: UserAttributes["password"]) {
      const password = value.toString();

      if (password.length < 8 || password.length > 20) {
        throw new Error("Длинна пароля может быть от 8 до 20 символов");
      }

      const currentInstance = <User>this;

      const hashPassword = bcrypt.hashSync(currentInstance.email + password, 5);
      this.setDataValue("password", hashPassword);
    },
  })
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

exhaustiveModelCheck<UserAttributes, UserCreationAttributes, User>(true);
