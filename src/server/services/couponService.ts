import type { CouponCreationAttributes } from "../models/Coupon";
import { Coupon } from "../models/Coupon";
import { OrderCoupon } from "../models/OrderCoupon";
import { exhaustiveCheck } from "../../helpers/exhaustiveCheck";
import { ApiError } from "../error/ApiError";

export type CreateCouponData = CouponCreationAttributes;
export type UpdateCouponData = Partial<CouponCreationAttributes>;

class CouponService {
  async create(data: CreateCouponData) {
    return await Coupon.create(data);
  }

  async getOne(id: number) {
    if (!id) {
      throw ApiError.badRequest(
        "Для получения промокода не был предоставлен ID"
      );
    }

    const coupon = await Coupon.findOne({ where: { id } });

    if (!coupon) {
      throw ApiError.badRequest(`Промокод с id - ${id} не найден`);
    }

    return coupon;
  }

  async getAll() {
    return await Coupon.findAll();
  }

  async update(id: number, updateData: UpdateCouponData) {
    const coupon = await this.getOne(id);

    return await coupon.update(updateData);
  }

  async delete(id: number) {
    const coupon = await this.getOne(id);

    return await coupon.destroy();
  }

  async checkValid(identifier: { id: number } | { key: string }) {
    const coupon = await Coupon.findOne({ where: identifier });

    if (!coupon) {
      throw ApiError.badRequest(
        `Промокод с ${"id" in identifier ? "id" : "key"} - ${
          "id" in identifier ? identifier.id : identifier.key
        } не найден`
      );
    }

    if (coupon.expiresTime && coupon.expiresTime > Date.now()) {
      throw ApiError.badRequest(`У этого промокода истек срок действия`);
    }

    if (coupon.expiresCount) {
      const suppressCount = await OrderCoupon.count({
        where: { couponId: coupon.id },
      });
      if (suppressCount >= coupon.expiresCount) {
        throw ApiError.badRequest(
          `Этот промокод уже был применен максимальное количество раз`
        );
      }
    }
  }

  async apply(ids: number[], subtotal: number) {
    if (ids.length === 0) {
      throw ApiError.badRequest(
        "Для применения промокодов не был предоставлен ни один ID"
      );
    }

    const coupons = await Coupon.findAll({ where: { id: ids } });

    if (coupons.length === 0) {
      throw ApiError.badRequest(
        `Ни один промокод с id - ${ids.join(", ")} не найден`
      );
    }

    let total = subtotal;
    for (const coupon of coupons) {
      switch (coupon.type) {
        case "AMOUNT":
          total -= coupon.value;
          break;
        case "PERCENTAGE":
          // always calculate percentage sale from subtotal, for guarantee of stable cost
          total -= subtotal * (coupon.value / 100);
          break;
        default:
          exhaustiveCheck(coupon.type);
          throw ApiError.badRequest(
            "Не известный тип промокода для применения"
          );
      }
    }

    if (total < 0) {
      total = 0;
    }

    return total;
  }
}

export const couponService = new CouponService();
