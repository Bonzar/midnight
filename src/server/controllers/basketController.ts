import { ApiError } from "../error/ApiError";
import type { RequestHandler } from "express";
import type { BasketProduct } from "../models/BasketProduct";
import type {
  AddBasketProductData,
  GetBasketResult,
  UpdateBasketProductData,
} from "../services/basketService";
import { basketService } from "../services/basketService";
import type { BasketCoupon } from "../models/BasketCoupon";
import { parseInt } from "../../helpers/parseInt";

export type GetBasketResponse = GetBasketResult;

export type AddBasketProductBody = AddBasketProductData;
export type UpdateBasketProductBody = UpdateBasketProductData;
export type DeleteBasketProductBody = { basketId: number; productId: number };

export type AddBasketCouponBody = { basketId: number; couponId: number };
export type DeleteBasketCouponBody = { basketId: number; couponId: number };

class BasketController {
  getBasket: RequestHandler<{ id: string }, GetBasketResponse, void, void> =
    async (req, res, next) => {
      try {
        const basketId = parseInt(req.params.id);

        const basket = await basketService.getBasket(basketId);

        res.status(200).json(basket);
      } catch (error) {
        next(
          ApiError.badRequest("При получении корзины произошла ошибка", error)
        );
      }
    };

  addProduct: RequestHandler<void, BasketProduct, AddBasketProductBody, void> =
    async (req, res, next) => {
      try {
        const basketProductNote = await basketService.addProduct(req.body);

        res.status(200).json(basketProductNote);
      } catch (error) {
        next(
          ApiError.badRequest(
            "При добавлении товара в корзину произошла ошибка",
            error
          )
        );
      }
    };

  updateProduct: RequestHandler<
    void,
    BasketProduct,
    UpdateBasketProductBody,
    void
  > = async (req, res, next) => {
    try {
      const basketProductNote = await basketService.updateProduct(req.body);

      res.status(200).json(basketProductNote);
    } catch (error) {
      next(
        ApiError.badRequest(
          "При обновлении товара в корзине произошла ошибка",
          error
        )
      );
    }
  };

  deleteProduct: RequestHandler<void, void, DeleteBasketProductBody, void> =
    async (req, res, next) => {
      try {
        await basketService.deleteProduct(
          req.body.basketId,
          req.body.productId
        );

        res.status(200).end();
      } catch (error) {
        next(
          ApiError.badRequest(
            "При удалении товара из корзины произошла ошибка",
            error
          )
        );
      }
    };

  addCoupon: RequestHandler<void, BasketCoupon, AddBasketCouponBody, void> =
    async (req, res, next) => {
      try {
        const basketCouponNote = await basketService.addCoupon(
          req.body.basketId,
          req.body.couponId
        );

        res.status(200).json(basketCouponNote);
      } catch (error) {
        next(
          ApiError.badRequest(
            "При применении промокода к корзине произошла ошибка",
            error
          )
        );
      }
    };

  deleteCoupon: RequestHandler<void, void, DeleteBasketCouponBody, void> =
    async (req, res, next) => {
      try {
        await basketService.deleteCoupon(req.body.basketId, req.body.couponId);

        res.status(200).end();
      } catch (error) {
        next(
          ApiError.badRequest(
            "При удалении промокода из корзины произошла ошибка",
            error
          )
        );
      }
    };
}

export const basketController = new BasketController();
