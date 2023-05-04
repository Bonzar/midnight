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
import type { ProductCreationAttributes } from "./Product";
import { Product } from "./Product";
import { DataTypes } from "sequelize";

interface ProductImageAttributes {
  id: ProductImage["id"];
  url: ProductImage["url"];
  sort: ProductImage["sort"];
  description: ProductImage["description"];
  productId: ProductImage["productId"];
}

export type ProductImageCreationAttributes = Optional<
  Omit<ProductImageAttributes, "id">,
  never
> & {
  product?: ProductCreationAttributes;
};

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
  @Column(DataTypes.INTEGER)
  productId!: number | null;

  @BelongsTo(() => Product)
  product!: Product;
}

exhaustiveModelCheck<
  ProductImageAttributes,
  ProductImageCreationAttributes,
  ProductImage
>(true);
