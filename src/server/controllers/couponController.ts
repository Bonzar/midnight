import type { Request, Response } from "express";

class CouponController {
  async create(req: Request, res: Response) {}

  async get(req: Request, res: Response) {}

  async getAll(req: Request, res: Response) {}

  async update(req: Request, res: Response) {}

  async delete(req: Request, res: Response) {}
}

export const couponController = new CouponController();
