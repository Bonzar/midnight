import type { Optional } from "sequelize";
import { DataTypes } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  Default,
  HasMany,
  HasOne,
  Is,
  IsEmail,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import type {
  ModelAttr,
  ModelAttributesWithSelectedAssociations,
} from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
import type { AddressAttributes, AddressCreationAttributes } from "./Address";
import { Address } from "./Address";
import type { BasketAttributes, BasketCreationAttributes } from "./Basket";
import { Basket } from "./Basket";
import type { OrderAttributes, OrderCreationAttributes } from "./Order";
import { Order } from "./Order";
import type {
  WishlistAttributes,
  WishlistCreationAttributes,
} from "./Wishlist";
import { Wishlist } from "./Wishlist";
import bcrypt from "bcrypt";
import type { TokenAttributes, TokenCreationAttributes } from "./Token";
import { Token } from "./Token";
import type { NotUndefined } from "../../../types/types";

export interface UserAttributes {
  id: User["id"];
  firstName: User["firstName"];
  lastName: User["lastName"];
  middleName: User["middleName"];
  email: User["email"];
  password: User["password"];
  isActivated: User["isActivated"];
  role: User["role"];
}

interface UserAssociationsAttributes {
  basket: BasketAttributes;
  wishlist: WishlistAttributes;
  orders: OrderAttributes[];
  addresses: AddressAttributes[];
  token: TokenAttributes;
}

export type UserCreationAttributes = Optional<
  Omit<UserAttributes, "id">,
  | "isActivated"
  | "role"
  | "firstName"
  | "lastName"
  | "middleName"
  | "email"
  | "password"
>;

interface UserCreationAssociationsAttributes {
  basket: Omit<BasketCreationAttributes, "userId" | "user">;
  wishlist: Omit<WishlistCreationAttributes, "userId" | "user">;
  orders: Omit<OrderCreationAttributes, "userId" | "user">[];
  addresses: Omit<AddressCreationAttributes, "userId" | "user">[];
  token: Omit<TokenCreationAttributes, "userId" | "user">;
}

@Table
export class User extends Model<
  UserAttributes,
  UserCreationAttributes & Partial<UserCreationAssociationsAttributes>
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(true)
  @NotEmpty
  @Column(DataTypes.STRING)
  firstName!: string | null;

  @AllowNull(true)
  @NotEmpty
  @Column(DataTypes.STRING)
  lastName!: string | null;

  @AllowNull(true)
  @NotEmpty
  @Column(DataTypes.STRING)
  middleName!: string | null;

  @AllowNull(true) // only for guests
  @IsEmail
  @NotEmpty
  @Is(async function guestEmptyEmail(email?: User["email"]) {
    // @ts-ignore - Can't infer `this` type
    const currentInstance: User = this;

    const role = currentInstance.getDataValue("role");

    if (role === "GUEST" && email) {
      // Guests should have empty email
      throw new Error("Гость не может иметь email");
    }

    if (email === null || email === undefined) {
      // Guests have empty email
      if (role === "GUEST") return;

      throw new Error("Email не может быть пустым");
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      throw new Error("Аккаунт с такие email уже зарегистрирован");
    }
  })
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

  @AllowNull(false)
  @Default("USER")
  @Column({ type: DataTypes.ENUM, values: ["USER", "ADMIN", "GUEST"] })
  role!: "USER" | "ADMIN" | "GUEST";

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

export type UserCreationAttributesWithAssociations<
  Associations extends keyof Omit<
    UserCreationAssociationsAttributes,
    keyof NestedAssociate
  >,
  NestedAssociate extends Partial<UserCreationAssociationsAttributes> = {}
> = ModelAttributesWithSelectedAssociations<
  UserCreationAttributes,
  UserCreationAssociationsAttributes,
  Associations,
  NestedAssociate
>;

exhaustiveModelCheck<
  NotUndefined<ModelAttr<User>>,
  NotUndefined<UserAttributes>,
  NotUndefined<UserCreationAttributes>,
  NotUndefined<UserAssociationsAttributes>,
  NotUndefined<UserCreationAssociationsAttributes>
>();
