import type { BasketProductCreationAttributes } from "../models/BasketProduct";
import { BasketProduct } from "../models/BasketProduct";
import { BasketCoupon } from "../models/BasketCoupon";
import { couponService } from "./couponService";
import { Basket } from "../models/Basket";
import { Product } from "../models/Product";
import { Coupon } from "../models/Coupon";
import { ProductImage } from "../models/ProductImage";

export type GetBasketResult = {
  basket: Basket;
  total: number;
  subtotal: number;
};

export type AddBasketProductData = BasketProductCreationAttributes;

export type UpdateBasketProductData = Partial<BasketProductCreationAttributes> &
  Pick<BasketProductCreationAttributes, "basketId" | "productId">;

class BasketService {
  async getOneBasket(id: number): Promise<GetBasketResult> {
    if (!id) {
      throw new Error("Для получения корзины не был предоставлен ID");
    }

    const basket = await Basket.findOne({
      where: { id },
      include: [
        {
          model: BasketProduct,
          include: [
            {
              model: Product,
              include: [
                { model: ProductImage, limit: 1, order: [["sort", "ASC"]] },
              ],
            },
          ],
        },
        { model: BasketCoupon, include: [Coupon] },
      ],
    });

    if (!basket) {
      throw new Error(`Корзина с id - ${id} не найдена`);
    }

    // Calculating total and subtotal
    const subtotal = basket.basketProducts.reduce(
      (total, currentBasketProduct) =>
        total +
        currentBasketProduct.product.price * currentBasketProduct.quantity,
      0
    );

    let total = subtotal;
    if (basket.basketCoupons.length > 0) {
      total = await couponService.apply(
        basket.basketCoupons.map((coupon) => coupon.couponId),
        total
      );
    }

    return { basket, total, subtotal };
  }

  async getOneProduct(basketId: number, productId: number) {
    if (typeof productId === "undefined" || typeof basketId === "undefined") {
      throw new Error(
        `Для получения продукта в корзине не был предоставлен ID: ${[
          typeof productId === "undefined" && "продукта",
          typeof basketId === "undefined" && "корзины",
        ]
          .filter(Boolean)
          .join(", ")}`
      );
    }

    const basketProductNote = await BasketProduct.findOne({
      where: { productId, basketId },
    });

    if (!basketProductNote) {
      throw new Error(
        `Запись о продукте в корзине с идентификаторами: id корзины - ${basketId}, id продукта - ${productId} — не найдена`
      );
    }

    return basketProductNote;
  }

  async addProduct(data: AddBasketProductData) {
    return await BasketProduct.create(data);
  }

  async updateProduct(updateData: UpdateBasketProductData) {
    const { productId, basketId, ...newData } = updateData;

    const basketProductNote = await this.getOneProduct(basketId, productId);

    return await basketProductNote.update(newData);
  }

  async deleteProduct(basketId: number, productId: number) {
    const basketProductNote = await this.getOneProduct(basketId, productId);

    return await basketProductNote.destroy();
  }

  async addCoupon(basketId: number, couponId: number) {
    await couponService.checkValid({ id: couponId });

    return await BasketCoupon.create({ basketId, couponId });
  }

  async deleteCoupon(basketId: number, couponId: number) {
    const basketCouponNote = await BasketCoupon.findOne({
      where: { couponId, basketId },
    });

    if (!basketCouponNote) {
      throw new Error(
        `Запись о примененном купоне в корзине с идентификаторами: id корзины - ${basketId}, id купона - ${couponId} — не найдена`
      );
    }

    return await basketCouponNote.destroy();
  }
}

export const basketService = new BasketService();
