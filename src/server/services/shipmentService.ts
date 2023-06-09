import type { ShipmentTypeCreationAttributes } from "../models/ShipmentType";
import { ShipmentType } from "../models/ShipmentType";
import { ApiError } from "../error/ApiError";

export type CreateShipmentTypeData = ShipmentTypeCreationAttributes;
export type UpdateShipmentTypeData = Partial<ShipmentTypeCreationAttributes>;

class ShipmentService {
  async createType(data: CreateShipmentTypeData) {
    return await ShipmentType.create(data);
  }

  async getAllTypes() {
    return await ShipmentType.findAll();
  }

  async getOneType(id: number) {
    if (!id) {
      throw ApiError.badRequest(
        "Для получения типа доставки не был предоставлен ID"
      );
    }

    const shipmentType = await ShipmentType.findOne({ where: { id } });

    if (!shipmentType) {
      throw ApiError.badRequest(`Тип доставки с id - ${id} не найден`);
    }

    return shipmentType;
  }

  async updateType(id: number, updateData: UpdateShipmentTypeData) {
    const shipmentType = await this.getOneType(id);

    return await shipmentType.update(updateData);
  }

  async deleteType(id: number) {
    const shipmentType = await this.getOneType(id);

    return await shipmentType.destroy();
  }
}

export const shipmentService = new ShipmentService();
