import type { RequestHandler } from "express";
import type { CouponAttributes } from "../models/Coupon";
import { ApiError } from "../error/ApiError";
import type {
  CreateCouponData,
  UpdateCouponData,
} from "../services/couponService";
import { couponService } from "../services/couponService";
import { parseAppInt } from "../../helpers/parseAppInt";

export type CreateCouponBody = CreateCouponData;
export type CreateCouponResponse = CouponAttributes;

export type GetAllCouponsResponse = CouponAttributes[];

export type UpdateCouponBody = UpdateCouponData;
export type UpdateCouponResponse = CouponAttributes;

class CouponController {
  create: RequestHandler<void, CreateCouponResponse, CreateCouponBody, void> =
    async (req, res, next) => {
      try {
        const coupon = await couponService.create(req.body);

        res.status(200).json(coupon);
      } catch (error) {
        next(
          ApiError.setDefaultMessage(
            "При создании промокода произошла ошибка",
            error
          )
        );
      }
    };

  getAll: RequestHandler<void, GetAllCouponsResponse, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const coupons = await couponService.getAll();

      res.status(200).json(coupons);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При получении всех промокодов произошла ошибка",
          error
        )
      );
    }
  };

  update: RequestHandler<
    { id: string },
    UpdateCouponResponse,
    UpdateCouponBody,
    void
  > = async (req, res, next) => {
    try {
      const couponId = parseAppInt(req.params.id);

      const coupon = await couponService.update(couponId, req.body);

      res.status(200).json(coupon);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          `При обновлении промокода с id - ${req.params.id} произошла ошибка`,
          error
        )
      );
    }
  };

  delete: RequestHandler<{ id: string }, void, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const couponId = parseAppInt(req.params.id);

      await couponService.delete(couponId);

      res.status(200).end();
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          `При удалении промокода с id - ${req.params.id} произошла ошибка`,
          error
        )
      );
    }
  };
}

export const couponController = new CouponController();
