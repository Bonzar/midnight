import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Min,
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
import type { ProductAttributes, ProductCreationAttributes } from "./Product";
import { Product } from "./Product";
import { DataTypes } from "sequelize";
import type { NotUndefined } from "../../../types/types";

interface ProductImageBaseAttributes {
  id: ProductImage["id"];
  url: ProductImage["url"];
  sort: ProductImage["sort"];
  description: ProductImage["description"];
  productId: ProductImage["productId"];
}

interface ProductImageAssociationsAttributes {
  product: ProductAttributes;
}

export type ProductImageCreationAttributes = Optional<
  Omit<ProductImageBaseAttributes, "id">,
  never
> & {
  product?: ProductCreationAttributes;
};

@Table
export class ProductImage extends Model<
  ProductImageBaseAttributes,
  ProductImageCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @NotEmpty
  @Unique
  @Column
  url!: string;

  @AllowNull(false)
  @Min(0)
  @Unique("Sort_ProductId")
  @Column
  sort!: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  description!: string;

  @AllowNull(true)
  @ForeignKey(() => Product)
  @Unique("Sort_ProductId")
  @Column(DataTypes.INTEGER)
  productId!: number | null;

  @BelongsTo(() => Product)
  product!: Product;
}

export type ProductImageAttributes = ProductImageBaseAttributes &
  Partial<ProductImageAssociationsAttributes>;

export type ProductImageAttributesWithAssociations<
  Associations extends keyof Omit<
    ProductImageAssociationsAttributes,
    keyof NestedAssociate
  >,
  NestedAssociate extends Partial<ProductImageAssociationsAttributes> = {}
> = ModelAttributesWithSelectedAssociations<
  ProductImageAttributes,
  ProductImageAssociationsAttributes,
  Associations,
  NestedAssociate
>;

exhaustiveModelCheck<
  NotUndefined<ModelAttr<ProductImage>>,
  NotUndefined<ProductImageAttributes>,
  NotUndefined<ProductImageCreationAttributes>
>();
