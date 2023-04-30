import type { Request, Response } from "express";

class OrderController {
  async create(req: Request, res: Response) {}

  async get(req: Request, res: Response) {}

  async update(req: Request, res: Response) {}

  async delete(req: Request, res: Response) {}
}

export const orderController = new OrderController();
