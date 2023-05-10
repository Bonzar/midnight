import type { RequestHandler } from "express";
import type { Order } from "../models/Order";
import { ApiError } from "../error/ApiError";
import type {
  CreateOrderData,
  UpdateOrderData,
} from "../services/orderService";
import { orderService } from "../services/orderService";
import { parseAppInt } from "../../helpers/parseAppInt";
import type { OrderAttributes } from "../models/Order";
import type { AllAsString } from "../../../types/types";

export type CreateOrderBody = CreateOrderData;
export type UpdateOrderBody = UpdateOrderData;

export type GetAllOrdersResponse = { rows: Order[]; count: number };
export type GetAllOrdersQuery = {
  status?: OrderAttributes["status"];
  limit?: number;
  page?: number;
};

class OrderController {
  create: RequestHandler<void, Order, CreateOrderBody, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const order = await orderService.create(req.body);

      res.status(200).json(order);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При создании заказа произошла ошибка",
          error
        )
      );
    }
  };

  get: RequestHandler<{ id: string }, Order, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const orderId = parseAppInt(req.params.id);

      const order = await orderService.getOne(orderId);

      res.status(200).json(order);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          `При получении заказа с id - ${req.params.id} произошла ошибка`,
          error
        )
      );
    }
  };

  getAll: RequestHandler<
    void,
    GetAllOrdersResponse,
    void,
    AllAsString<GetAllOrdersQuery>
  > = async (req, res, next) => {
    try {
      let limit;
      if (req.query.limit) {
        limit = parseAppInt(req.query.limit);
      }

      let page;
      if (req.query.page) {
        page = parseAppInt(req.query.page);
      }

      const orders = await orderService.getAll(
        req.query.status as OrderAttributes["status"],
        limit,
        page
      );

      res.status(200).json(orders);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При получении всех заказов произошла ошибка",
          error
        )
      );
    }
  };

  update: RequestHandler<{ id: string }, Order, UpdateOrderBody, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const orderId = parseAppInt(req.params.id);

      const order = await orderService.update(orderId, req.body);

      res.status(200).json(order);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          `При обновлении заказа с id - ${req.params.id} произошла ошибка`,
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
      const orderId = parseAppInt(req.params.id);

      await orderService.delete(orderId);

      res.status(200).end();
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          `При удалении заказа с id - ${req.params.id} произошла ошибка`,
          error
        )
      );
    }
  };
}

export const orderController = new OrderController();
