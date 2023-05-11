import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
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
import type { ProductCreationAttributes, ProductAttributes } from "./Product";
import { Product } from "./Product";
import type { NotUndefined } from "../../../types/types";

interface ProductMetaBaseAttributes {
  id: ProductMeta["id"];
  title: ProductMeta["title"];
  description: ProductMeta["description"];
  productId: ProductMeta["productId"];
}

interface ProductMetaAssociationsAttributes {
  product: ProductAttributes;
}

export type ProductMetaCreationAttributes = Optional<
  Omit<ProductMetaBaseAttributes, "id">,
  never
> & {
  product?: ProductCreationAttributes;
};

@Table
export class ProductMeta extends Model<
  ProductMetaBaseAttributes,
  ProductMetaCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Unique("Title_ProductId")
  @NotEmpty
  @Column
  title!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  description!: string;

  @AllowNull(false)
  @ForeignKey(() => Product)
  @Unique("Title_ProductId")
  @Column
  productId!: number;

  @BelongsTo(() => Product)
  product!: Product;
}

export type ProductMetaAttributes = ProductMetaBaseAttributes &
  Partial<ProductMetaAssociationsAttributes>;

export type ProductMetaAttributesWithAssociations<
  Associations extends keyof Omit<
    ProductMetaAssociationsAttributes,
    keyof NestedAssociate
  >,
  NestedAssociate extends Partial<ProductMetaAssociationsAttributes> = {}
> = ModelAttributesWithSelectedAssociations<
  ProductMetaAttributes,
  ProductMetaAssociationsAttributes,
  Associations,
  NestedAssociate
>;

exhaustiveModelCheck<
  NotUndefined<ModelAttr<ProductMeta>>,
  NotUndefined<ProductMetaAttributes>,
  NotUndefined<ProductMetaCreationAttributes>
>();
