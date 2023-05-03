import type { OrderAttributes, OrderCreationAttributes } from "../models/Order";
import { Order } from "../models/Order";
import type { Transaction, WhereOptions } from "sequelize";
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

    const checkPromises = [
      // Check on coupons valid
      ...orderData.orderCoupons.map((coupon) =>
        couponService.checkValid({ id: coupon.couponId })
      ),
      // Check on products stocks
      ...orderData.orderProducts.map((orderProduct) =>
        productService.checkStock(orderProduct.productId, orderProduct.quantity)
      ),
    ];

    // wait for all checks
    await Promise.all(checkPromises);

    //todo add total calculation

    return await sequelize.transaction(async (transaction) => {
      const orderProducts = await Promise.all(
        orderData.orderProducts.map(async (orderProduct) => {
          const product = await productService.getOne(
            orderProduct.productId,
            transaction
          );

          // Decrease a product stocks
          return product.update(
            {
              stock: product.stock - orderProduct.quantity,
            },
            { transaction }
          );
        })
      );

      // Save current product price as salePrice
      orderData.orderProducts.map(
        (orderProduct, index) =>
          (orderProduct.salePrice = orderProducts[index].price)
      );

      // Calculating total
      let total = orderProducts.reduce(
        (total, currentProduct, index) =>
          total +
          currentProduct.price * orderData.orderProducts[index].quantity,
        0
      );

      if (orderData.orderCoupons.length > 0) {
        total = await couponService.apply(
          orderData.orderCoupons.map((coupon) => coupon.couponId),
          total,
          transaction
        );
      }

      // Create order + corresponding notes in OrderCoupon and OrderProduct
      return await Order.create(
        { ...orderData, total },
        {
          include: [
            { model: OrderCoupon, as: "orderCoupons" },
            { model: OrderProduct, as: "orderProducts" },
            Shipment,
          ],
          transaction,
        }
      );
    });
  }

  async getOne(id: number, transaction?: Transaction) {
    if (!id) {
      throw new Error("Для получения заказа не был предоставлен ID");
    }

    const order = await Order.findOne({ where: { id }, transaction });

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
    const order = await this.getOne(id);

    return order.update(updateData);
  }

  async delete(id: number) {
    const order = await this.getOne(id);

    return order.destroy();
  }
}

export const orderService = new OrderService();
