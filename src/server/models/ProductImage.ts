import { Optional } from "sequelize";
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

interface IProductImageAttributes {
  id: number;
  url: string;
  sort: number;
  productId: number;
}

interface IProductImageCreationAttributes
  extends Optional<IProductImageAttributes, "id"> {}

@Table
export class ProductImage extends Model<
  IProductImageAttributes,
  IProductImageCreationAttributes
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
  @ForeignKey(() => Product)
  @Unique("Sort_ProductId")
  @Column
  productId!: number;

  @BelongsTo(() => Product)
  product!: Product;
}

exhaustiveModelCheck<IProductImageAttributes, ProductImage>();
