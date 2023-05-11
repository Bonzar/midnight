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
import type {
  ModelAttr,
  ModelAttributesWithSelectedAssociations,
} from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
import type { BasketAttributes, BasketCreationAttributes } from "./Basket";
import { Basket } from "./Basket";
import type { ProductAttributes, ProductCreationAttributes } from "./Product";
import { Product } from "./Product";
import type { NotUndefined } from "../../../types/types";

interface BasketProductBaseAttributes {
  id: BasketProduct["id"];
  quantity: BasketProduct["quantity"];
  basketId: BasketProduct["basketId"];
  productId: BasketProduct["productId"];
}

interface BasketProductAssociationsAttributes {
  basket: BasketAttributes;
  product: ProductAttributes;
}

export type BasketProductCreationAttributes = Optional<
  Omit<BasketProductBaseAttributes, "id">,
  never
> & {
  basket?: BasketCreationAttributes;
  product?: ProductCreationAttributes;
};

@Table
export class BasketProduct extends Model<
  BasketProductBaseAttributes,
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

export type BasketProductAttributes = BasketProductBaseAttributes &
  Partial<BasketProductAssociationsAttributes>;

export type BasketProductAttributesWithAssociations<
  Associations extends keyof Omit<
    BasketProductAssociationsAttributes,
    keyof NestedAssociate
  >,
  NestedAssociate extends Partial<BasketProductAssociationsAttributes> = {}
> = ModelAttributesWithSelectedAssociations<
  BasketProductAttributes,
  BasketProductAssociationsAttributes,
  Associations,
  NestedAssociate
>;

exhaustiveModelCheck<
  NotUndefined<ModelAttr<BasketProduct>>,
  NotUndefined<BasketProductAttributes>,
  NotUndefined<BasketProductCreationAttributes>
>();
