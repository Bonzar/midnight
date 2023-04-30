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
  id: number;
  quantity: number;
  basketId: number;
  productId: number;
}

interface BasketProductCreationAttributes
  extends Optional<BasketProductAttributes, "id"> {}

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
