import type { RequestHandler } from "express";
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
export type CreateOrderResponse = OrderAttributes;

export type GetOneOrderResponse = OrderAttributes;

export type UpdateOrderBody = UpdateOrderData;
export type UpdateOrderResponse = OrderAttributes;

export type GetAllOrdersResponse = {
  rows: OrderAttributes[];
  count: number;
};
export type GetAllOrdersQuery = {
  status?: OrderAttributes["status"];
  limit?: number;
  page?: number;
};

class OrderController {
  create: RequestHandler<void, CreateOrderResponse, CreateOrderBody, void> =
    async (req, res, next) => {
      try {
        const userId = req.user.id;

        const order = await orderService.create(userId, req.body);

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

  get: RequestHandler<{ id: string }, GetOneOrderResponse, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const userId = req.user.id;
      const orderId = parseAppInt(req.params.id);

      const order = await orderService.getOneOrder(userId, orderId);

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
      const userId = req.user.id;

      let limit;
      if (req.query.limit) {
        limit = parseAppInt(req.query.limit);
      }

      let page;
      if (req.query.page) {
        page = parseAppInt(req.query.page);
      }

      const orders = await orderService.getAll(
        userId,
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

  update: RequestHandler<
    { id: string },
    UpdateOrderResponse,
    UpdateOrderBody,
    void
  > = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const orderId = parseAppInt(req.params.id);

      const order = await orderService.update(userId, orderId, req.body);

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
      const userId = req.user.id;
      const orderId = parseAppInt(req.params.id);

      await orderService.delete(userId, orderId);

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
