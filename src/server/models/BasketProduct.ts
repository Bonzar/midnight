import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  ForeignKey,
  Min,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import { Basket } from "./Basket";
import { Product } from "./Product";

interface BasketProductAttributes {
  id: BasketProduct["id"];
  quantity: BasketProduct["quantity"];
  basketId: BasketProduct["basketId"];
  productId: BasketProduct["productId"];
}

export type BasketProductCreationAttributes = Optional<
  Omit<BasketProductAttributes, "id">,
  never
>;

@Table
export class BasketProduct extends Model<
  BasketProductAttributes,
  BasketProductCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Min(1)
  @Column
  quantity!: number;

  @AllowNull(false)
  @ForeignKey(() => Basket)
  @Column
  basketId!: number;

  @AllowNull(false)
  @ForeignKey(() => Product)
  @Column
  productId!: number;
}

exhaustiveModelCheck<BasketProductAttributes, BasketProduct>();
