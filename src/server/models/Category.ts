import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Is,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import { Product } from "./Product";

export interface ICategoryAttributes {
  id: number;
  name: string;
  parentCategoryId: number | null;
}

export interface ICategoryCreationAttributes
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
  @Is(async function noDuplicatesNull(value?: number | null) {
    // skip duplicate check if parentCategoryId not null
    if (value) return;

    // @ts-ignore - Can't infer `this` type
    const currentInstance: Category = this;

    const name = currentInstance.getDataValue("name");

    const duplicateNameNull = await Category.findOne({
      where: { name, parentCategoryId: null },
    });

    if (duplicateNameNull) {
      throw new Error(`Главная категория с названием '${name}' уже существует`);
    }
  })
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
