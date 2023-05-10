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
import type { ModelKeys } from "../helpers/exhaustiveModelCheck";
import { keysCheck } from "../helpers/exhaustiveModelCheck";
import type { ProductAttributes, ProductCreationAttributes } from "./Product";
import { Product } from "./Product";
import { DataTypes } from "sequelize";

interface ProductImageBaseAttributes {
  id: ProductImage["id"];
  url: ProductImage["url"];
  sort: ProductImage["sort"];
  description: ProductImage["description"];
  productId: ProductImage["productId"];
}

interface ProductImageAssociationAttributes {
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
  Partial<ProductImageAssociationAttributes>;

keysCheck<ModelKeys<ProductImage>, keyof ProductImageAttributes>();
keysCheck<ProductImageAttributes, keyof ModelKeys<ProductImage>>();
keysCheck<
  ProductImageCreationAttributes,
  keyof Omit<ModelKeys<ProductImage>, "id">
>();
