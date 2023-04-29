import { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import { Product } from "./Product";

interface ICategoryAttributes {
  id: number;
  name: string;
  parentCategoryId: number | null;
}

interface ICategoryCreationAttributes
  extends Optional<ICategoryAttributes, "id" | "parentCategoryId"> {}

@Table
export class Category extends Model<
  ICategoryAttributes,
  ICategoryCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @NotEmpty
  @Unique("Name_ParentCategoryId")
  @Column
  name!: string;

  @AllowNull(true)
  @ForeignKey(() => Category)
  @Unique("Name_ParentCategoryId")
  @Column
  parentCategoryId!: number;

  @BelongsTo(() => Category)
  parentCategory!: Category;

  @HasMany(() => Category)
  childCategories!: Category;

  @HasMany(() => Product)
  products!: Product[];
}

exhaustiveModelCheck<ICategoryAttributes, Category>();
