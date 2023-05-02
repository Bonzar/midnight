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

interface ProductMetaAttributes {
  id: ProductMeta["id"];
  title: ProductMeta["title"];
  description: ProductMeta["description"];
  productId: ProductMeta["productId"];
}

export type ProductMetaCreationAttributes = Optional<
  ProductMetaAttributes,
  "id"
>;

@Table
export class ProductMeta extends Model<
  ProductMetaAttributes,
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

exhaustiveModelCheck<ProductMetaAttributes, ProductMeta>();
