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
  Unique,
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

export interface BasketProductAttributes {
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
  Omit<BasketProductAttributes, "id">,
  never
>;

interface BasketProductCreationAssociationsAttributes {
  basket: BasketCreationAttributes;
  product: ProductCreationAttributes;
}

@Table
export class BasketProduct extends Model<
  BasketProductAttributes,
  BasketProductCreationAttributes &
    Partial<BasketProductCreationAssociationsAttributes>
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
  @Unique("basketId_productId")
  @Column
  basketId!: number;

  @BelongsTo(() => Basket)
  basket!: Basket;

  @AllowNull(false)
  @ForeignKey(() => Product)
  @Unique("basketId_productId")
  @Column
  productId!: number;

  @BelongsTo(() => Product)
  product!: Product;
}

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
  NotUndefined<BasketProductCreationAttributes>,
  NotUndefined<BasketProductAssociationsAttributes>,
  NotUndefined<BasketProductCreationAssociationsAttributes>
>();
