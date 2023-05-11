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
import type {
  CategoryAttributes,
  CategoryCreationAttributes,
} from "./Category";
import { Category } from "./Category";
import type {
  ProductImageAttributes,
  ProductImageCreationAttributes,
} from "./ProductImage";
import { ProductImage } from "./ProductImage";
import type {
  ProductMetaAttributes,
  ProductMetaCreationAttributes,
} from "./ProductMeta";
import { ProductMeta } from "./ProductMeta";
import type {
  OrderProductAttributes,
  OrderProductCreationAttributes,
} from "./OrderProduct";
import { OrderProduct } from "./OrderProduct";
import type { OrderAttributes, OrderCreationAttributes } from "./Order";
import { Order } from "./Order";
import type {
  BasketProductAttributes,
  BasketProductCreationAttributes,
} from "./BasketProduct";
import { BasketProduct } from "./BasketProduct";
import type { BasketAttributes, BasketCreationAttributes } from "./Basket";
import { Basket } from "./Basket";
import type {
  WishlistAttributes,
  WishlistCreationAttributes,
} from "./Wishlist";
import { Wishlist } from "./Wishlist";
import type {
  WishlistProductAttributes,
  WishlistProductCreationAttributes,
} from "./WishlistProduct";
import { WishlistProduct } from "./WishlistProduct";
import { DataTypes } from "sequelize";
import type {
  ModelAttr,
  ModelAttributesWithSelectedAssociations,
} from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
import type { NotUndefined } from "../../../types/types";

export interface ProductAttributes {
  id: Product["id"];
  name: Product["name"];
  description: Product["description"];
  price: Product["price"];
  discount: Product["discount"];
  stock: Product["stock"];
  categoryId: Product["categoryId"];
}

export interface ProductAssociationsAttributes {
  category: CategoryAttributes;
  productImages: ProductImageAttributes[];
  productMetas: ProductMetaAttributes[];
  orders: Array<OrderAttributes & { OrderProduct: OrderProductAttributes }>;
  baskets: Array<BasketAttributes & { BasketProduct: BasketProductAttributes }>;
  wishlist: Array<
    WishlistAttributes & { WishlistProduct: WishlistProductAttributes }
  >;
  orderProducts: OrderProductAttributes[];
  wishlistProducts: WishlistProductAttributes[];
  basketProducts: BasketProductAttributes[];
}

export type ProductCreationAttributes = Optional<
  Omit<ProductAttributes, "id">,
  "description" | "discount" | "stock"
> & {
  category?: CategoryCreationAttributes;
  productImages?: Omit<
    ProductImageCreationAttributes,
    "productId" | "product"
  >[];
  productMetas?: Omit<ProductMetaCreationAttributes, "productId" | "product">[];
  orders?: OrderCreationAttributes[];
  baskets?: BasketCreationAttributes[];
  wishlist?: WishlistCreationAttributes[];
  orderProducts?: Omit<
    OrderProductCreationAttributes,
    "productId" | "product"
  >[];
  wishlistProducts?: Omit<
    WishlistProductCreationAttributes,
    "productId" | "product"
  >[];
  basketProducts?: Omit<
    BasketProductCreationAttributes,
    "productId" | "product"
  >[];
};

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
  @Column(DataTypes.STRING)
  description!: string | null;

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

  @HasMany(() => OrderProduct)
  orderProducts!: OrderProduct[];

  @BelongsToMany(() => Basket, () => BasketProduct)
  baskets!: Array<Basket & { BasketProduct: BasketProduct }>;

  @HasMany(() => BasketProduct)
  basketProducts!: BasketProduct[];

  @BelongsToMany(() => Wishlist, () => WishlistProduct)
  wishlist!: Array<Wishlist & { WishlistProduct: WishlistProduct }>;

  @HasMany(() => WishlistProduct)
  wishlistProducts!: WishlistProduct[];
}

export type ProductAttributesWithAssociations<
  Associations extends keyof Omit<
    ProductAssociationsAttributes,
    keyof NestedAssociate
  >,
  NestedAssociate extends Partial<ProductAssociationsAttributes> = {}
> = ModelAttributesWithSelectedAssociations<
  ProductAttributes,
  ProductAssociationsAttributes,
  Associations,
  NestedAssociate
>;

exhaustiveModelCheck<
  NotUndefined<ModelAttr<Product>>,
  NotUndefined<ProductAttributes>,
  NotUndefined<ProductCreationAttributes>,
  NotUndefined<ProductAssociationsAttributes>
>();
