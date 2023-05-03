import type { BasketProductCreationAttributes } from "../models/BasketProduct";
import { BasketProduct } from "../models/BasketProduct";
import { BasketCoupon } from "../models/BasketCoupon";
import { couponService } from "./couponService";
import type { Transaction } from "sequelize";

export type AddBasketProductData = BasketProductCreationAttributes;
export type UpdateBasketProductData = Partial<BasketProductCreationAttributes> &
  Pick<BasketProductCreationAttributes, "basketId" | "productId">;

class BasketService {
  async getBasketProduct(
    productId: number,
    basketId: number,
    transaction?: Transaction
  ) {
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
      transaction,
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

    const basketProductNote = await this.getBasketProduct(productId, basketId);

    return await basketProductNote.update(newData);
  }

  async deleteProduct(basketId: number, productId: number) {
    const basketProductNote = await this.getBasketProduct(productId, basketId);

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
