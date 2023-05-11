import type {
  OrderAttributes,
  OrderCreationAttributes,
  OrderCreationAttributesWithAssociations,
} from "../models/Order";
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
import { ApiError } from "../error/ApiError";
import { checkIdsPresent } from "../helpers/checkIdsPresent";

export type CreateOrderData = Omit<
  OrderCreationAttributesWithAssociations<
    "shipment" | "orderCoupons" | "orderProducts"
  >,
  "total" | "userId"
>;

export type UpdateOrderData = Omit<
  Partial<OrderCreationAttributes>,
  "userId" | "total" | "isPaid" | "shipmentId"
>;

class OrderService {
  async create(userId: number, orderData: CreateOrderData) {
    if (!orderData.orderProducts || orderData.orderProducts.length === 0) {
      throw ApiError.badRequest("Заказ не может быть пустым");
    }

    if (!orderData.orderCoupons) orderData.orderCoupons = [];

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

    return await sequelize.transaction(async () => {
      const orderProducts = await Promise.all(
        orderData.orderProducts.map(async (orderProduct) => {
          const product = await productService.getOne(orderProduct.productId);

          // Decrease a product stocks
          return product.update({
            stock: product.stock - orderProduct.quantity,
          });
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
          total
        );
      }

      // Create order + corresponding notes in OrderCoupon and OrderProduct
      return await Order.create(
        { ...orderData, total, userId },
        {
          include: [
            { model: OrderCoupon, as: "orderCoupons" },
            { model: OrderProduct, as: "orderProducts" },
            Shipment,
          ],
        }
      );
    });
  }

  public async getOneOrder(userId: number, orderId: number) {
    this.checkIdsPresent(userId, orderId, "получения заказа");

    const order = await Order.findOne({ where: { id: orderId, userId } });

    if (!order) {
      throw ApiError.badRequest(
        `Заказ с id - ${orderId}, у пользователя с id - ${userId}, не найден`
      );
    }

    return order;
  }

  async getAll(
    userId: number,
    status?: OrderAttributes["status"],
    limit: number = DEFAULT_ITEMS_LIMIT,
    page: number = DEFAULT_ITEMS_PAGE
  ) {
    const where: WhereOptions<OrderAttributes> = { userId };
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

  async update(userId: number, orderId: number, updateData: UpdateOrderData) {
    this.checkIdsPresent(userId, orderId, "обновления заказа");

    // prevent update sensitive data
    const {
      userId: _userId,
      total: _total,
      isPaid: _isPaid,
      shipmentId: _shipmentId,
      ...safeUpdateData
    } = updateData as typeof updateData &
      Record<"userId" | "total" | "isPaid" | "shipmentId", never>;

    const order = await this.getOneOrder(userId, orderId);
    if (order.isPaid) {
      throw ApiError.badRequest("Оплаченный заказ нельзя изменить");
    }

    return await order.update(safeUpdateData);
  }

  async delete(userId: number, orderId: number) {
    this.checkIdsPresent(userId, orderId, "удаления заказа");

    const order = await this.getOneOrder(userId, orderId);

    return await order.destroy();
  }

  private checkIdsPresent(
    userId: number,
    orderId: number,
    messageAction: string
  ) {
    try {
      checkIdsPresent(
        [
          { value: userId, whoseIdentifier: "пользователя" },
          { value: orderId, whoseIdentifier: "заказа" },
        ],
        messageAction
      );
    } catch (error) {
      throw ApiError.badRequest(
        `При проверке идентификаторов для работы с заказами произошла ошибка`,
        error
      );
    }
  }
}

export const orderService = new OrderService();
