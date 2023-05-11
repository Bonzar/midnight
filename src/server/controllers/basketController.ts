import { ApiError } from "../error/ApiError";
import type { RequestHandler } from "express";
import type {
  BasketProductAttributes,
  BasketProductAttributesWithAssociations,
} from "../models/BasketProduct";
import type {
  AddBasketProductData,
  UpdateBasketProductData,
} from "../services/basketService";
import { basketService } from "../services/basketService";
import type {
  BasketCouponAttributes,
  BasketCouponAttributesWithAssociations,
} from "../models/BasketCoupon";
import type { BasketAttributesWithAssociations } from "../models/Basket";
import type { ProductAttributesWithAssociations } from "../models/Product";

export type GetBasketResponse = {
  basket: BasketAttributesWithAssociations<
    never,
    {
      basketProducts: Array<
        BasketProductAttributesWithAssociations<
          never,
          {
            product: ProductAttributesWithAssociations<"productImages">;
          }
        >
      >;
      basketCoupons: BasketCouponAttributesWithAssociations<"coupon">[];
    }
  >;
  total: number;
  subtotal: number;
};

export type AddBasketProductBody = AddBasketProductData;
export type AddBasketProductResponse = BasketProductAttributes;

export type UpdateBasketProductBody = UpdateBasketProductData;
export type UpdateBasketProductResponse = BasketProductAttributes;

export type DeleteBasketProductBody = { basketId: number; productId: number };

export type AddBasketCouponBody = { basketId: number; couponId: number };
export type AddBasketCouponResponse = BasketCouponAttributes;

export type DeleteBasketCouponBody = { basketId: number; couponId: number };

class BasketController {
  getBasket: RequestHandler<void, GetBasketResponse, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const userId = req.user.id;

      const basket = await basketService.getOneDetailedBasket(userId);

      res.status(200).json(basket);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При получении корзины произошла ошибка",
          error
        )
      );
    }
  };

  addProduct: RequestHandler<
    void,
    AddBasketProductResponse,
    AddBasketProductBody,
    void
  > = async (req, res, next) => {
    try {
      const userId = req.user.id;

      const basketProductNote = await basketService.addProduct(
        userId,
        req.body
      );

      res.status(200).json(basketProductNote);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При добавлении товара в корзину произошла ошибка",
          error
        )
      );
    }
  };

  updateProduct: RequestHandler<
    void,
    UpdateBasketProductResponse,
    UpdateBasketProductBody,
    void
  > = async (req, res, next) => {
    try {
      const userId = req.user.id;

      const basketProductNote = await basketService.updateProduct(
        userId,
        req.body
      );

      res.status(200).json(basketProductNote);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При обновлении товара в корзине произошла ошибка",
          error
        )
      );
    }
  };

  deleteProduct: RequestHandler<void, void, DeleteBasketProductBody, void> =
    async (req, res, next) => {
      try {
        const userId = req.user.id;

        await basketService.deleteProduct(userId, req.body.productId);

        res.status(200).end();
      } catch (error) {
        next(
          ApiError.setDefaultMessage(
            "При удалении товара из корзины произошла ошибка",
            error
          )
        );
      }
    };

  addCoupon: RequestHandler<
    void,
    AddBasketCouponResponse,
    AddBasketCouponBody,
    void
  > = async (req, res, next) => {
    try {
      const userId = req.user.id;

      const basketCouponNote = await basketService.addCoupon(
        userId,
        req.body.couponId
      );

      res.status(200).json(basketCouponNote);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При применении промокода к корзине произошла ошибка",
          error
        )
      );
    }
  };

  deleteCoupon: RequestHandler<void, void, DeleteBasketCouponBody, void> =
    async (req, res, next) => {
      try {
        const userId = req.user.id;

        await basketService.deleteCoupon(userId, req.body.couponId);

        res.status(200).end();
      } catch (error) {
        next(
          ApiError.setDefaultMessage(
            "При удалении промокода из корзины произошла ошибка",
            error
          )
        );
      }
    };
}

export const basketController = new BasketController();
