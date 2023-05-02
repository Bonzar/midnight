import type { OrderAttributes, OrderCreationAttributes } from "../models/Order";
import { Order } from "../models/Order";
import type { WhereOptions } from "sequelize";
import {
  DEFAULT_ITEMS_LIMIT,
  DEFAULT_ITEMS_PAGE,
} from "../../helpers/constants";

export type CreateOrderData = Omit<OrderCreationAttributes, "id">;
export type UpdateOrderData = Omit<Partial<OrderCreationAttributes>, "id">;

class OrderService {
  async create(data: CreateOrderData) {
    return await Order.create(data);
  }

  async get(id: number) {
    const order = await Order.findOne({ where: { id } });

    if (!order) {
      throw new Error(`Заказ с id - ${id} не найден`);
    }

    return order;
  }

  async getAll(
    status?: OrderAttributes["status"],
    limit: number = DEFAULT_ITEMS_LIMIT,
    page: number = DEFAULT_ITEMS_PAGE
  ) {
    const where: WhereOptions<OrderAttributes> = {};
    if (status) {
      where.status = status;
    }

    const offset = limit * page - limit;

    return await Order.findAndCountAll({
      where,
      limit,
      offset,
    });
  }

  async update(id: number, updateData: UpdateOrderData) {
    const order = await Order.findOne({ where: { id } });

    if (!order) {
      throw new Error(`Заказ с id - ${id} не найден`);
    }

    return order.update(updateData);
  }

  async delete(id: number) {
    const order = await Order.findOne({ where: { id } });

    if (!order) {
      throw new Error(`Заказ с id - ${id} не найден`);
    }

    return order.destroy();
  }
}

export const orderService = new OrderService();
