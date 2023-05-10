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
import type { ModelKeys } from "../helpers/exhaustiveModelCheck";
import { keysCheck } from "../helpers/exhaustiveModelCheck";
import type { ProductCreationAttributes, ProductAttributes } from "./Product";
import { Product } from "./Product";

interface ProductMetaBaseAttributes {
  id: ProductMeta["id"];
  title: ProductMeta["title"];
  description: ProductMeta["description"];
  productId: ProductMeta["productId"];
}

interface ProductMetaAssociationAttributes {
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
  Partial<ProductMetaAssociationAttributes>;

keysCheck<ModelKeys<ProductMeta>, keyof ProductMetaAttributes>();
keysCheck<ProductMetaAttributes, keyof ModelKeys<ProductMeta>>();
keysCheck<
  ProductMetaCreationAttributes,
  keyof Omit<ModelKeys<ProductMeta>, "id">
>();
