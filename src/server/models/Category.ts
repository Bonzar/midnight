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
import type {
  ModelAttr,
  ModelAttributesWithSelectedAssociations,
} from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
import type { ProductAttributes, ProductCreationAttributes } from "./Product";
import { Product } from "./Product";
import { DataTypes } from "sequelize";
import type { NotUndefined } from "../../../types/types";

interface CategoryBaseAttributes {
  id: Category["id"];
  name: Category["name"];
  parentCategoryId: Category["parentCategoryId"];
}

interface CategoryAssociationsAttributes {
  parentCategory: CategoryAttributes;
  childCategories: CategoryAttributes[];
  products: ProductAttributes[];
}

export type CategoryCreationAttributes = Optional<
  Omit<CategoryBaseAttributes, "id">,
  "parentCategoryId"
> & {
  parentCategory?: CategoryCreationAttributes;
  childCategories?: Omit<
    CategoryCreationAttributes,
    "parentCategoryId" | "parentCategory"
  >[];
  products?: Omit<ProductCreationAttributes, "categoryId" | "category">[];
};

@Table
export class Category extends Model<
  CategoryBaseAttributes,
  CategoryCreationAttributes
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
  @Is(async function noDuplicatesNull(
    value?: CategoryAttributes["parentCategoryId"]
  ) {
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
  @Column(DataTypes.INTEGER)
  parentCategoryId!: number | null;

  @BelongsTo(() => Category)
  parentCategory!: Category;

  @HasMany(() => Category)
  childCategories!: Category[];

  @HasMany(() => Product)
  products!: Product[];
}

export type CategoryAttributes = CategoryBaseAttributes &
  Partial<CategoryAssociationsAttributes>;

export type CategoryAttributesWithAssociations<
  Associations extends keyof Omit<
    CategoryAssociationsAttributes,
    keyof NestedAssociate
  >,
  NestedAssociate extends Partial<CategoryAssociationsAttributes> = {}
> = ModelAttributesWithSelectedAssociations<
  CategoryAttributes,
  CategoryAssociationsAttributes,
  Associations,
  NestedAssociate
>;

exhaustiveModelCheck<
  NotUndefined<ModelAttr<Category>>,
  NotUndefined<CategoryAttributes>,
  NotUndefined<CategoryCreationAttributes>
>();
