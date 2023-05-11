import type { RequestHandler } from "express";
import { ApiError } from "../error/ApiError";
import type {
  CreateAddressData,
  UpdateAddressData,
  UpdateUserData,
} from "../services/userService";
import { userService } from "../services/userService";
import type { AddressAttributes } from "../models/Address";
import { parseAppInt } from "../../helpers/parseAppInt";
import type { UserAttributes } from "../models/User";

export type GetUserResponse = UserAttributes;

export type UpdateUserBody = UpdateUserData;
export type UpdateUserResponse = UserAttributes;

export type CreateAddressBody = CreateAddressData;
export type CreateAddressResponse = AddressAttributes;

export type GetAddressResponse = AddressAttributes;

export type UpdateAddressBody = UpdateAddressData;
export type UpdateAddressResponse = AddressAttributes;

class UserController {
  getUser: RequestHandler<void, GetUserResponse, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const userId = req.user.id;

      const user = await userService.getOneDetailedUser(userId);

      res.status(200).json(user);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При получении данных пользователя произошла ошибка",
          error
        )
      );
    }
  };

  updateUser: RequestHandler<void, UpdateUserResponse, UpdateUserBody, void> =
    async (req, res, next) => {
      try {
        const userId = req.user.id;

        const user = await userService.updateUser(userId, req.body);

        res.status(200).json(user);
      } catch (error) {
        next(
          ApiError.setDefaultMessage(
            "При обновлении данных пользователя произошла ошибка",
            error
          )
        );
      }
    };

  createAddress: RequestHandler<
    void,
    CreateAddressResponse,
    CreateAddressBody,
    void
  > = async (req, res, next) => {
    try {
      const userId = req.user.id;

      const address = await userService.createAddress(userId, req.body);

      res.status(200).json(address);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При создании адреса произошла ошибка",
          error
        )
      );
    }
  };

  getAddress: RequestHandler<{ id: string }, GetAddressResponse, void, void> =
    async (req, res, next) => {
      try {
        const userId = req.user.id;
        const addressId = parseAppInt(req.params.id);

        const address = await userService.getOneAddress(userId, addressId);

        res.status(200).json(address);
      } catch (error) {
        next(
          ApiError.setDefaultMessage(
            "При получении адреса произошла ошибка",
            error
          )
        );
      }
    };

  updateAddress: RequestHandler<
    { id: string },
    UpdateAddressResponse,
    UpdateAddressBody,
    void
  > = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const addressId = parseAppInt(req.params.id);

      const address = await userService.updateAddress(
        userId,
        addressId,
        req.body
      );

      res.status(200).json(address);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При обновлении адреса произошла ошибка",
          error
        )
      );
    }
  };

  deleteAddress: RequestHandler<{ id: string }, void, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const userId = req.user.id;
      const addressId = parseAppInt(req.params.id);

      await userService.deleteAddress(userId, addressId);

      res.status(200).end();
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При удалении адреса произошла ошибка",
          error
        )
      );
    }
  };
}

export const userController = new UserController();
