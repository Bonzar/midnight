import type { RequestHandler } from "express";
import type { Coupon } from "../models/Coupon";
import { ApiError } from "../error/ApiError";
import type {
  CreateCouponData,
  UpdateCouponData,
} from "../services/couponService";
import { couponService } from "../services/couponService";
import { parseInt } from "../../helpers/parseInt";

export type CreateCouponBody = CreateCouponData;
export type UpdateCouponBody = UpdateCouponData;

class CouponController {
  create: RequestHandler<void, Coupon, CreateCouponBody, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const coupon = await couponService.create(req.body);

      res.status(200).json(coupon);
    } catch (error) {
      next(
        ApiError.badRequest("При создании промокода произошла ошибка", error)
      );
    }
  };

  getAll: RequestHandler<void, Coupon[], void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const coupons = await couponService.getAll();

      res.status(200).json(coupons);
    } catch (error) {
      next(
        ApiError.badRequest(
          "При получении всех промокодов произошла ошибка",
          error
        )
      );
    }
  };

  update: RequestHandler<{ id: string }, Coupon, UpdateCouponBody, void> =
    async (req, res, next) => {
      try {
        const couponId = parseInt(req.params.id);

        const coupon = await couponService.update(couponId, req.body);

        res.status(200).json(coupon);
      } catch (error) {
        next(
          ApiError.badRequest(
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
      const couponId = parseInt(req.params.id);

      await couponService.delete(couponId);

      res.status(200).end();
    } catch (error) {
      next(
        ApiError.badRequest(
          `При удалении промокода с id - ${req.params.id} произошла ошибка`,
          error
        )
      );
    }
  };
}

export const couponController = new CouponController();
