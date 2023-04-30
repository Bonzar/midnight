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
import { exhaustiveModelCheck } from "./helpers";
import { Product } from "./Product";

export interface IProductMetaAttributes {
  id: number;
  title: string;
  description: string;
  productId: number;
}

export interface IProductMetaCreationAttributes
  extends Optional<IProductMetaAttributes, "id"> {}

@Table
export class ProductMeta extends Model<
  IProductMetaAttributes,
  IProductMetaCreationAttributes
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

exhaustiveModelCheck<IProductMetaAttributes, ProductMeta>();
