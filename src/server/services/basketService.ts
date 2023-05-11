import type { BasketProductCreationAttributes } from "../models/BasketProduct";
import { BasketProduct } from "../models/BasketProduct";
import { BasketCoupon } from "../models/BasketCoupon";
import { couponService } from "./couponService";
import { Basket } from "../models/Basket";
import { Product } from "../models/Product";
import { Coupon } from "../models/Coupon";
import { ProductImage } from "../models/ProductImage";
import { ApiError } from "../error/ApiError";
import { sequelize } from "../database";
import type { Includeable } from "sequelize";
import { checkIdsPresent } from "../helpers/checkIdsPresent";

export type AddBasketProductData = Omit<
  BasketProductCreationAttributes,
  "basketId"
>;

export type UpdateBasketProductData = Partial<
  Omit<BasketProductCreationAttributes, "basketId" | "productId" | "quantity">
> &
  Pick<BasketProductCreationAttributes, "productId" | "quantity">;

class BasketService {
  private checkIdsPresent(
    userId: number,
    productId: number,
    messageAction: string
  ) {
    try {
      checkIdsPresent(
        [
          { value: userId, whoseIdentifier: "пользователя" },
          { value: productId, whoseIdentifier: "товара" },
        ],
        messageAction
      );
    } catch (error) {
      throw ApiError.badRequest(
        `При проверке идентификаторов для работы с корзиной произошла ошибка`,
        error
      );
    }
  }

  public async getOneDetailedBasket(userId: number) {
    const basket = await this.getOneBasket(userId, [
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
    ]);

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

  private async getOneBasket(
    userId: number,
    include?: Includeable | Includeable[]
  ) {
    if (!userId) {
      throw ApiError.badRequest(
        "Для получения корзины не был предоставлен ID пользователя"
      );
    }

    const basket = await Basket.findOne({
      where: { userId },
      include,
    });

    if (!basket) {
      throw ApiError.badRequest(
        `Корзина с id пользователя - ${userId} не найдена`
      );
    }

    return basket;
  }

  private async getOneProduct(userId: number, productId: number) {
    this.checkIdsPresent(userId, productId, "получения товара в корзине");

    const basket = await this.getOneBasket(userId, {
      model: BasketProduct,
    });

    const basketProductNote = basket.basketProducts.find(
      (basketProduct) => basketProduct.productId === productId
    );

    if (!basketProductNote) {
      throw ApiError.badRequest(
        `Запись о товара в корзине с идентификаторами: id пользователя - ${userId}, id товара - ${productId} — не найдена`
      );
    }

    return basketProductNote;
  }

  public async addProduct(userId: number, data: AddBasketProductData) {
    if (!userId) {
      throw ApiError.badRequest(
        "Для добавления товара в корзину не был предоставлен ID пользователя"
      );
    }

    return await sequelize.transaction(async () => {
      const basket = await this.getOneBasket(userId);

      return await BasketProduct.create({ ...data, basketId: basket.id });
    });
  }

  public async updateProduct(
    userId: number,
    updateData: UpdateBasketProductData
  ) {
    if (!userId) {
      throw ApiError.badRequest(
        "Для обновления товара в корзине не был предоставлен ID пользователя"
      );
    }

    return await sequelize.transaction(async () => {
      const { productId, ...newData } = updateData;

      const basketProductNote = await this.getOneProduct(userId, productId);

      return await basketProductNote.update(newData);
    });
  }

  public async deleteProduct(userId: number, productId: number) {
    if (!userId) {
      throw ApiError.badRequest(
        "Для удаления товара из корзины не был предоставлен ID пользователя"
      );
    }

    return await sequelize.transaction(async () => {
      const basketProductNote = await this.getOneProduct(userId, productId);

      return await basketProductNote.destroy();
    });
  }

  public async addCoupon(userId: number, couponId: number) {
    if (!userId) {
      throw ApiError.badRequest(
        "Для добавления промокода в корзину не был предоставлен ID пользователя"
      );
    }

    return await sequelize.transaction(async () => {
      await couponService.checkValid({ id: couponId });

      const basket = await this.getOneBasket(userId);

      return await BasketCoupon.create({ basketId: basket.id, couponId });
    });
  }

  public async deleteCoupon(userId: number, couponId: number) {
    if (!userId) {
      throw ApiError.badRequest(
        "Для удаления промокода из корзины не был предоставлен ID пользователя"
      );
    }

    return await sequelize.transaction(async () => {
      const basket = await this.getOneBasket(userId, { model: BasketCoupon });

      const basketCouponNote = basket.basketCoupons.find(
        (basketCoupon) => basketCoupon.couponId === couponId
      );

      if (!basketCouponNote) {
        throw ApiError.badRequest(
          `Запись о примененном купоне в корзине с идентификаторами: id пользователя - ${userId}, id купона - ${couponId} — не найдена`
        );
      }

      return await basketCouponNote.destroy();
    });
  }
}

export const basketService = new BasketService();
