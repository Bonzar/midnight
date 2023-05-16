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
import { productService } from "../services/productService";
import { couponService } from "../services/couponService";
import type { AllAsString } from "../../../types/types";
import { parseAppInt } from "../../helpers/parseAppInt";

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

export type DeleteBasketProductBody = { productId: number };

export type AddBasketCouponBody = { couponId: number };
export type AddBasketCouponResponse = BasketCouponAttributes;

export type DeleteBasketCouponBody = { couponId: number };

export type GuestAddProductQuery = AddBasketProductData;
export type GuestAddProductResponse = AddBasketProductData & { valid: boolean };

export type GuestAddCouponQuery = { couponKey: string };
export type GuestAddCouponResponse = { couponKey: string; valid: boolean };

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

  guestAddProduct: RequestHandler<
    void,
    GuestAddProductResponse,
    void,
    AllAsString<GuestAddProductQuery>
  > = async (req, res, next) => {
    try {
      const productId = parseAppInt(req.query.productId);
      const quantity = parseAppInt(req.query.quantity);

      await productService.checkStock(productId, quantity);

      res.status(200).json({ productId, quantity, valid: true });
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При добавлении товара в корзину гостя произошла ошибка",
          error
        )
      );
    }
  };

  guestAddCoupon: RequestHandler<
    void,
    GuestAddCouponResponse,
    void,
    AllAsString<GuestAddCouponQuery>
  > = async (req, res, next) => {
    try {
      await couponService.checkValid({ key: req.query.couponKey });

      res.status(200).json({ couponKey: req.query.couponKey, valid: true });
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При добавлении товара в корзину гостя произошла ошибка",
          error
        )
      );
    }
  };
}

export const basketController = new BasketController();
