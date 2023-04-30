import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import { User } from "./User";
import { Product } from "./Product";
import { BasketProduct } from "./BasketProduct";

interface IBasketAttributes {
  id: number;
  userId: number;
}

interface IBasketCreationAttributes extends Optional<IBasketAttributes, "id"> {}

@Table
export class Basket extends Model<
  IBasketAttributes,
  IBasketCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Unique
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsToMany(() => Product, () => BasketProduct)
  products!: Array<Product & { BasketProduct: BasketProduct }>;
}

exhaustiveModelCheck<IBasketAttributes, Basket>();
