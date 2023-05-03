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
import type { UserCreationAttributes } from "./User";
import { User } from "./User";
import type { ProductCreationAttributes } from "./Product";
import { Product } from "./Product";
import { BasketProduct } from "./BasketProduct";

interface BasketAttributes {
  id: Basket["id"];
  userId: Basket["userId"];
}

export type BasketCreationAttributes = Optional<
  Omit<BasketAttributes, "id">,
  never
> & {
  user?: Omit<UserCreationAttributes, "basket">;
  products?: ProductCreationAttributes[];
};

@Table
export class Basket extends Model<BasketAttributes, BasketCreationAttributes> {
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

exhaustiveModelCheck<BasketAttributes, Basket>();
