import type { OrderAttributes, OrderCreationAttributes } from "../models/Order";
import { Order } from "../models/Order";
import type { WhereOptions } from "sequelize";
import {
  DEFAULT_ITEMS_LIMIT,
  DEFAULT_ITEMS_PAGE,
} from "../../helpers/constants";
import { Shipment } from "../models/Shipment";
import { couponService } from "./couponService";
import { OrderProduct } from "../models/OrderProduct";
import { OrderCoupon } from "../models/OrderCoupon";
import { sequelize } from "../database";
import { productService } from "./productService";

export type CreateOrderData = OrderCreationAttributes &
  Required<
    Pick<OrderCreationAttributes, "orderCoupons" | "orderProducts" | "shipment">
  >;

export type UpdateOrderData = Partial<OrderCreationAttributes>;

class OrderService {
  async create(orderData: CreateOrderData) {
    if (orderData.orderProducts.length === 0) {
      throw new Error("Заказ не может быть пустым");
    }

    // Check on coupons valid
    await Promise.all(
      orderData.orderCoupons.map(
        async (coupon) =>
          await couponService.checkValid({ id: coupon.couponId })
      )
    );

    // Check on products stocks
    await Promise.all(
      orderData.orderProducts.map(
        async (orderProduct) =>
          await productService.checkStock(
            orderProduct.productId,
            orderProduct.quantity
          )
      )
    );

    return await sequelize.transaction(async (transaction) => {
      // Decrease a product stocks
      await Promise.all(
        orderData.orderProducts.map(async (orderProduct) => {
          const product = await productService.getOne(
            orderProduct.productId,
            transaction
          );

          return product.update(
            {
              stock: product.stock - orderProduct.quantity,
            },
            { transaction }
          );
        })
      );

      // Create order + corresponding notes in OrderCoupon and OrderProduct
      return await Order.create(orderData, {
        include: [
          { model: OrderCoupon, as: "orderCoupons" },
          { model: OrderProduct, as: "orderProducts" },
          Shipment,
        ],
        transaction,
      });
    });
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
