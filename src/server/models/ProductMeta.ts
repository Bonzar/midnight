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
import type { ModelAttr } from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
import type { ProductCreationAttributes, ProductAttributes } from "./Product";
import { Product } from "./Product";
import type { NotUndefined } from "../../../types/types";

export interface ProductMetaAttributes {
  id: ProductMeta["id"];
  title: ProductMeta["title"];
  description: ProductMeta["description"];
  productId: ProductMeta["productId"];
}

interface ProductMetaAssociationsAttributes {
  product: ProductAttributes;
}

export type ProductMetaCreationAttributes = Optional<
  Omit<ProductMetaAttributes, "id">,
  never
>;

interface ProductMetaCreationAssociationsAttributes {
  product: ProductCreationAttributes;
}

@Table
export class ProductMeta extends Model<
  ProductMetaAttributes,
  ProductMetaCreationAttributes &
    Partial<ProductMetaCreationAssociationsAttributes>
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

exhaustiveModelCheck<
  NotUndefined<ModelAttr<ProductMeta>>,
  NotUndefined<ProductMetaAttributes>,
  NotUndefined<ProductMetaCreationAttributes>,
  NotUndefined<ProductMetaAssociationsAttributes>,
  NotUndefined<ProductMetaCreationAssociationsAttributes>
>();
