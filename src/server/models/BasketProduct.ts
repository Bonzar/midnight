import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Min,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "../helpers/exhaustiveModelCheck";
import type { BasketCreationAttributes } from "./Basket";
import { Basket } from "./Basket";
import type { ProductCreationAttributes } from "./Product";
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
> & {
  basket?: BasketCreationAttributes;
  product?: ProductCreationAttributes;
};

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

  @BelongsTo(() => Basket)
  basket!: Basket;

  @AllowNull(false)
  @ForeignKey(() => Product)
  @Column
  productId!: number;

  @BelongsTo(() => Product)
  product!: Product;
}

exhaustiveModelCheck<
  BasketProductAttributes,
  BasketProductCreationAttributes,
  BasketProduct
>(true);
