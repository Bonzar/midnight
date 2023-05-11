import type { BasketProductCreationAttributes } from "../models/BasketProduct";
import { BasketProduct } from "../models/BasketProduct";
import { BasketCoupon } from "../models/BasketCoupon";
import { couponService } from "./couponService";
import { Basket } from "../models/Basket";
import { Product } from "../models/Product";
import { Coupon } from "../models/Coupon";
import { ProductImage } from "../models/ProductImage";
import { ApiError } from "../error/ApiError";

export type AddBasketProductData = BasketProductCreationAttributes;

export type UpdateBasketProductData = Partial<BasketProductCreationAttributes> &
  Pick<BasketProductCreationAttributes, "basketId" | "productId">;

class BasketService {
  async getOneBasket(id: number) {
    if (!id) {
      throw ApiError.badRequest("Для получения корзины не был предоставлен ID");
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
      throw ApiError.badRequest(`Корзина с id - ${id} не найдена`);
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
      throw ApiError.badRequest(
        `Для получения товара в корзине не был предоставлен ID: ${[
          typeof productId === "undefined" && "товара",
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
      throw ApiError.badRequest(
        `Запись о товара в корзине с идентификаторами: id корзины - ${basketId}, id товара - ${productId} — не найдена`
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
      throw ApiError.badRequest(
        `Запись о примененном купоне в корзине с идентификаторами: id корзины - ${basketId}, id купона - ${couponId} — не найдена`
      );
    }

    return await basketCouponNote.destroy();
  }
}

export const basketService = new BasketService();
