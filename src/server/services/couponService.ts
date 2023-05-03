import type { CouponCreationAttributes } from "../models/Coupon";
import { Coupon } from "../models/Coupon";
import { OrderCoupon } from "../models/OrderCoupon";

export type CreateCouponData = CouponCreationAttributes;
export type UpdateCouponData = Partial<CouponCreationAttributes>;

class CouponService {
  async create(data: CreateCouponData) {
    return await Coupon.create(data);
  }

  async getAll() {
    return await Coupon.findAll();
  }

  async update(id: number, updateData: UpdateCouponData) {
    const coupon = await Coupon.findOne({ where: { id } });

    if (!coupon) {
      throw new Error(`Промокод с id - ${id} не найден`);
    }

    return await coupon.update(updateData);
  }

  async delete(id: number) {
    const coupon = await Coupon.findOne({ where: { id } });

    if (!coupon) {
      throw new Error(`Промокод с id - ${id} не найден`);
    }

    return await coupon.destroy();
  }

  async checkValid(identifier: { id: number } | { key: string }) {
    const coupon = await Coupon.findOne({ where: identifier });

    if (!coupon) {
      throw new Error(
        `Промокод с ${"id" in identifier ? "id" : "key"} - ${
          "id" in identifier ? identifier.id : identifier.key
        } не найден`
      );
    }

    if (coupon.expiresTime && coupon.expiresTime > Date.now()) {
      throw new Error(`У этого промокода истек срок действия`);
    }

    if (coupon.expiresCount) {
      const suppressCount = await OrderCoupon.count({
        where: { couponId: coupon.id },
      });
      if (suppressCount >= coupon.expiresCount) {
        throw new Error(
          `Этот промокод уже был применен максимальное количество раз`
        );
      }
    }
  }
}

export const couponService = new CouponService();
