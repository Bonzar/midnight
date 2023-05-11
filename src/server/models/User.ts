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
import type {
  ModelAttr,
  ModelAttributesWithSelectedAssociations,
} from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
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
  "isActivated" | "role" | "lastName" | "middleName"
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

  @AllowNull(false)
  @Default("USER")
  @Column({ type: DataTypes.ENUM, values: ["USER", "ADMIN"] })
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
