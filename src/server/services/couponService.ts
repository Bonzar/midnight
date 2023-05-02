import type { CouponCreationAttributes } from "../models/Coupon";
import { Coupon } from "../models/Coupon";

export type CreateCouponData = Omit<CouponCreationAttributes, "id">;
export type UpdateCouponData = Omit<Partial<CouponCreationAttributes>, "id">;

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
}

export const couponService = new CouponService();
