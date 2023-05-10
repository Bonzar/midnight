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
import type { ModelKeys } from "../helpers/exhaustiveModelCheck";
import { keysCheck } from "../helpers/exhaustiveModelCheck";
import { Address } from "./Address";
import type { AddressCreationAttributes, AddressAttributes } from "./Address";
import { Basket } from "./Basket";
import type { BasketCreationAttributes, BasketAttributes } from "./Basket";
import { Order } from "./Order";
import type { OrderCreationAttributes, OrderAttributes } from "./Order";
import { Wishlist } from "./Wishlist";
import type {
  WishlistCreationAttributes,
  WishlistAttributes,
} from "./Wishlist";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import type { TokenAttributes, TokenCreationAttributes } from "./Token";
import { Token } from "./Token";

interface UserBaseAttributes {
  id: User["id"];
  firstName: User["firstName"];
  lastName: User["lastName"];
  middleName: User["middleName"];
  email: User["email"];
  password: User["password"];
  isActivated: User["isActivated"];
  activationLink: User["activationLink"];
  role: User["role"];
}

interface UserAssociationsAttributes {
  basket: BasketAttributes;
  wishlist: WishlistAttributes;
  orders: OrderAttributes;
  addresses: AddressAttributes;
  token: TokenAttributes;
}

export type UserCreationAttributes = Optional<
  Omit<UserBaseAttributes, "id">,
  "isActivated" | "activationLink" | "role" | "lastName" | "middleName"
> & {
  basket?: Omit<BasketCreationAttributes, "userId" | "user">;
  wishlist?: Omit<WishlistCreationAttributes, "userId" | "user">;
  orders?: Omit<OrderCreationAttributes, "userId" | "user">[];
  addresses?: Omit<AddressCreationAttributes, "userId" | "user">[];
  token?: Omit<TokenCreationAttributes, "userId" | "user">;
};

@Table
export class User extends Model<UserBaseAttributes, UserCreationAttributes> {
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
  isActivated!: boolean;

  //todo delete if unused OR remove default
  @AllowNull(false)
  // @Unique
  @NotEmpty
  @Default("123")
  @Column
  activationLink!: string;

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

  @HasOne(() => Token)
  token?: Token;
}

export type UserAttributes = UserBaseAttributes &
  Partial<UserAssociationsAttributes>;

keysCheck<ModelKeys<User>, keyof UserAttributes>();
keysCheck<UserAttributes, keyof ModelKeys<User>>();
keysCheck<UserCreationAttributes, keyof Omit<ModelKeys<User>, "id">>();
