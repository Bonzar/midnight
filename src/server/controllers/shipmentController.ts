import type { ShipmentTypeAttributesWithAssociations } from "../models/ShipmentType";
import type { RequestHandler } from "express";
import { ApiError } from "../error/ApiError";
import type {
  CreateShipmentTypeData,
  UpdateShipmentTypeData,
} from "../services/shipmentService";
import { shipmentService } from "../services/shipmentService";
import { parseAppInt } from "../../helpers/parseAppInt";

export type CreateShipmentTypeBody = CreateShipmentTypeData;
export type CreateShipmentTypeResponse =
  ShipmentTypeAttributesWithAssociations<never>;

export type GetAllShipmentTypesResponse =
  ShipmentTypeAttributesWithAssociations<never>[];

export type UpdateShipmentTypeBody = UpdateShipmentTypeData;
export type UpdateShipmentTypeResponse =
  ShipmentTypeAttributesWithAssociations<never>;

class ShipmentController {
  createType: RequestHandler<
    void,
    CreateShipmentTypeResponse,
    CreateShipmentTypeBody,
    void
  > = async (req, res, next) => {
    try {
      const shipmentType = await shipmentService.createType(req.body);

      res.status(200).json(shipmentType);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При создании типа доставки произошла ошибка",
          error
        )
      );
    }
  };

  getAllTypes: RequestHandler<void, GetAllShipmentTypesResponse, void, void> =
    async (req, res, next) => {
      try {
        const shipmentTypes = await shipmentService.getAllTypes();

        res.status(200).json(shipmentTypes);
      } catch (error) {
        next(
          ApiError.setDefaultMessage(
            "При получении всех типов доставки произошла ошибка",
            error
          )
        );
      }
    };

  updateType: RequestHandler<
    { id: string },
    UpdateShipmentTypeResponse,
    UpdateShipmentTypeBody,
    void
  > = async (req, res, next) => {
    try {
      const shipmentTypeId = parseAppInt(req.params.id);

      const shipmentType = await shipmentService.updateType(
        shipmentTypeId,
        req.body
      );

      res.status(200).json(shipmentType);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При обновлении типа доставки произошла ошибка",
          error
        )
      );
    }
  };

  deleteType: RequestHandler<{ id: string }, void, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const shipmentTypeId = parseAppInt(req.params.id);

      await shipmentService.deleteType(shipmentTypeId);

      res.status(200).end();
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При удалении типа доставки произошла ошибка",
          error
        )
      );
    }
  };
}

export const shipmentController = new ShipmentController();
