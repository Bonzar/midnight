import { ApiError } from "../error/ApiError";
import type { RequestHandler } from "express";
import type { BasketProductAttributesWithAssociations } from "../models/BasketProduct";
import type {
  AddBasketProductData,
  UpdateBasketProductData,
} from "../services/basketService";
import { basketService } from "../services/basketService";
import type { BasketCouponAttributesWithAssociations } from "../models/BasketCoupon";
import { parseAppInt } from "../../helpers/parseAppInt";
import type { BasketAttributesWithAssociations } from "../models/Basket";
import type { CouponAttributesWithAssociations } from "../models/Coupon";
import type { ProductAttributesWithAssociations } from "../models/Product";
import type { ProductImageAttributesWithAssociations } from "../models/ProductImage";

export type GetBasketResponse = {
  basket: BasketAttributesWithAssociations<
    never,
    {
      basketProducts: Array<
        BasketProductAttributesWithAssociations<
          never,
          {
            product: ProductAttributesWithAssociations<
              never,
              {
                productImages: ProductImageAttributesWithAssociations<never>[];
              }
            >;
          }
        >
      >;
      basketCoupons: BasketCouponAttributesWithAssociations<
        never,
        { coupon: CouponAttributesWithAssociations<never> }
      >[];
    }
  >;
  total: number;
  subtotal: number;
};

export type AddBasketProductBody = AddBasketProductData;
export type AddBasketProductResponse =
  BasketProductAttributesWithAssociations<never>;

export type UpdateBasketProductBody = UpdateBasketProductData;
export type UpdateBasketProductResponse =
  BasketProductAttributesWithAssociations<never>;

export type DeleteBasketProductBody = { basketId: number; productId: number };

export type AddBasketCouponBody = { basketId: number; couponId: number };
export type AddBasketCouponResponse =
  BasketCouponAttributesWithAssociations<never>;

export type DeleteBasketCouponBody = { basketId: number; couponId: number };

class BasketController {
  getBasket: RequestHandler<{ id: string }, GetBasketResponse, void, void> =
    async (req, res, next) => {
      try {
        const basketId = parseAppInt(req.params.id);

        const basket = await basketService.getOneBasket(basketId);

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
      const basketProductNote = await basketService.addProduct(req.body);

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
      const basketProductNote = await basketService.updateProduct(req.body);

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
        await basketService.deleteProduct(
          req.body.basketId,
          req.body.productId
        );

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
      const basketCouponNote = await basketService.addCoupon(
        req.body.basketId,
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
        await basketService.deleteCoupon(req.body.basketId, req.body.couponId);

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
