import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Min,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { exhaustiveModelCheck } from "./helpers";
import { Category } from "./Category";
import { ProductImage } from "./ProductImage";
import { ProductMeta } from "./ProductMeta";
import { OrderProduct } from "./OrderProduct";
import { Order } from "./Order";
import { BasketProduct } from "./BasketProduct";
import { Basket } from "./Basket";
import { Wishlist } from "./Wishlist";
import { WishlistProduct } from "./WishlistProduct";

export interface ProductAttributes {
  id: Product["id"];
  name: Product["name"];
  description: Product["description"] | null;
  price: Product["price"];
  discount: Product["discount"];
  stock: Product["stock"];
  categoryId: Product["categoryId"];
}

export type ProductCreationAttributes = Optional<
  ProductAttributes,
  "id" | "description" | "discount" | "stock"
>;

@Table
export class Product extends Model<
  ProductAttributes,
  ProductCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Unique("Name_CategoryId")
  @NotEmpty
  @Column
  name!: string;

  @AllowNull(true)
  @NotEmpty
  @Column
  description!: string;

  @AllowNull(false)
  @Min(0)
  @Column
  price!: number;

  @AllowNull(false)
  @Min(0)
  @Default(0)
  @Column
  discount!: number;

  @AllowNull(false)
  @Min(0)
  @Default(0)
  @Column
  stock!: number;

  @AllowNull(false)
  @Unique("Name_CategoryId")
  @ForeignKey(() => Category)
  @Column
  categoryId!: number;

  @BelongsTo(() => Category)
  category!: Category;

  @HasMany(() => ProductImage)
  productImages!: ProductImage[];

  @HasMany(() => ProductMeta)
  productMetas!: ProductMeta[];

  @BelongsToMany(() => Order, () => OrderProduct)
  orders!: Array<Order & { OrderProduct: OrderProduct }>;

  @BelongsToMany(() => Basket, () => BasketProduct)
  baskets!: Array<Basket & { BasketProduct: BasketProduct }>;

  @BelongsToMany(() => Wishlist, () => WishlistProduct)
  wishlist!: Array<Basket & { WishlistProduct: WishlistProduct }>;
}

exhaustiveModelCheck<ProductAttributes, Product>();
