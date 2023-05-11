import type { Optional } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import type {
  ModelAttr,
  ModelAttributesWithSelectedAssociations,
} from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
import type { UserCreationAttributes, UserAttributes } from "./User";
import { User } from "./User";
import type { ProductCreationAttributes, ProductAttributes } from "./Product";
import { Product } from "./Product";
import type {
  BasketProductAttributes,
  BasketProductCreationAttributes,
} from "./BasketProduct";
import { BasketProduct } from "./BasketProduct";
import type { CouponAttributes, CouponCreationAttributes } from "./Coupon";
import { Coupon } from "./Coupon";
import type {
  BasketCouponAttributes,
  BasketCouponCreationAttributes,
} from "./BasketCoupon";
import { BasketCoupon } from "./BasketCoupon";
import type { NotUndefined } from "../../../types/types";

export interface BasketAttributes {
  id: Basket["id"];
  userId: Basket["userId"];
}

interface BasketAssociationsAttributes {
  user: UserAttributes;
  products: Array<
    ProductAttributes & { BasketProduct: BasketProductAttributes }
  >;
  basketProducts: BasketProductAttributes[];
  coupons: Array<CouponAttributes & { BasketCoupon: BasketCouponAttributes }>;
  basketCoupons: BasketCouponAttributes[];
}

export type BasketCreationAttributes = Optional<
  Omit<BasketAttributes, "id">,
  never
> & {
  user?: Omit<UserCreationAttributes, "basket">;
  products?: ProductCreationAttributes[];
  basketProducts?: Omit<
    BasketProductCreationAttributes,
    "basketId" | "basket"
  >[];
  coupons?: CouponCreationAttributes[];
  basketCoupons?: Omit<BasketCouponCreationAttributes, "basketId" | "basket">[];
};

@Table
export class Basket extends Model<BasketAttributes, BasketCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Unique
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsToMany(() => Product, () => BasketProduct)
  products!: Array<Product & { BasketProduct: BasketProduct }>;

  @HasMany(() => BasketProduct)
  basketProducts!: BasketProduct[];

  @BelongsToMany(() => Coupon, () => BasketCoupon)
  coupons!: Array<Coupon & { BasketCoupon: BasketCoupon }>;

  @HasMany(() => BasketCoupon)
  basketCoupons!: BasketCoupon[];
}

export type BasketAttributesWithAssociations<
  Associations extends keyof Omit<
    BasketAssociationsAttributes,
    keyof NestedAssociate
  >,
  NestedAssociate extends Partial<BasketAssociationsAttributes> = {}
> = ModelAttributesWithSelectedAssociations<
  BasketAttributes,
  BasketAssociationsAttributes,
  Associations,
  NestedAssociate
>;

exhaustiveModelCheck<
  NotUndefined<ModelAttr<Basket>>,
  NotUndefined<BasketAttributes>,
  NotUndefined<BasketCreationAttributes>,
  NotUndefined<BasketAssociationsAttributes>
>();
