import type { BasketProductCreationAttributes } from "../models/BasketProduct";
import { BasketProduct } from "../models/BasketProduct";
import { BasketCoupon } from "../models/BasketCoupon";
import { couponService } from "./couponService";

export type AddBasketProductData = BasketProductCreationAttributes;
export type UpdateBasketProductData = Partial<BasketProductCreationAttributes> &
  Pick<BasketProductCreationAttributes, "basketId" | "productId">;

class BasketService {
  async addProduct(data: AddBasketProductData) {
    return await BasketProduct.create(data);
  }

  async updateProduct(updateData: UpdateBasketProductData) {
    const { basketId, productId, ...newData } = updateData;

    const basketProductNote = await BasketProduct.findOne({
      where: { productId, basketId },
    });

    if (!basketProductNote) {
      throw new Error(
        `Запись о продукте в корзине с идентификаторами: id корзины - ${basketId}, id продукта - ${productId} — не найдена`
      );
    }

    return await basketProductNote.update(newData);
  }

  async deleteProduct(basketId: number, productId: number) {
    const basketProductNote = await BasketProduct.findOne({
      where: { productId, basketId },
    });

    if (!basketProductNote) {
      throw new Error(
        `Запись о продукте в корзине с идентификаторами: id корзины - ${basketId}, id продукта - ${productId} — не найдена`
      );
    }

    return await basketProductNote.destroy();
  }

  async addCoupon(basketId: number, couponId: number) {
    await couponService.checkValid(couponId);

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
