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
import { exhaustiveModelCheck } from "./helpers";
import { Product } from "./Product";

interface ProductImageAttributes {
  id: ProductImage["id"];
  url: ProductImage["url"];
  sort: ProductImage["sort"];
  description: ProductImage["description"];
  productId: ProductImage["productId"] | null;
}

export type ProductImageCreationAttributes = Optional<
  ProductImageAttributes,
  "id"
>;

@Table
export class ProductImage extends Model<
  ProductImageAttributes,
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
  @Column
  productId!: number;

  @BelongsTo(() => Product)
  product!: Product;
}

exhaustiveModelCheck<ProductImageAttributes, ProductImage>();
