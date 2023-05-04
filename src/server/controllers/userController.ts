import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ApiError } from "../error/ApiError";
import type {
  CreateAddressData,
  CreateUserData,
  UpdateAddressData,
} from "../services/userService";
import { userService } from "../services/userService";
import type { User } from "../models/User";
import type { Address } from "../models/Address";
import { parseInt } from "../../helpers/parseInt";

type RegistrationUserBody = CreateUserData;
type CreateAddressBody = CreateAddressData;
type UpdateAddressBody = UpdateAddressData;

class UserController {
  registration: RequestHandler<void, User, RegistrationUserBody, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const user = await userService.create(req.body);

      res.status(200).json(user);
    } catch (error) {
      next(
        ApiError.badRequest(
          "При регистрации пользователя произошла ошибка",
          error
        )
      );
    }
  };

  login: RequestHandler<void, User, { id: number }, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const user = await userService.getOne(req.body.id);

      res.status(200).json(user);
    } catch (error) {
      next(ApiError.badRequest("При  произошла ошибка", error));
    }
  };

  async check(req: Request, res: Response, next: NextFunction) {
    if (!req.query.id) {
      return next(ApiError.forbidden("Ошибка"));
    }

    res.status(200).json({ message: "hello" });
  }

  createAddress: RequestHandler<void, Address, CreateAddressBody, void> =
    async (req, res, next) => {
      try {
        const address = await userService.createAddress(req.body);

        res.status(200).json(address);
      } catch (error) {
        next(
          ApiError.badRequest("При создании адреса произошла ошибка", error)
        );
      }
    };

  updateAddress: RequestHandler<
    { id: string },
    Address,
    UpdateAddressBody,
    void
  > = async (req, res, next) => {
    try {
      const addressId = parseInt(req.params.id);

      const address = await userService.updateAddress(addressId, req.body);

      res.status(200).json(address);
    } catch (error) {
      next(
        ApiError.badRequest("При обновлении адреса произошла ошибка", error)
      );
    }
  };

  deleteAddress: RequestHandler<{ id: string }, void, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const addressId = parseInt(req.params.id);

      await userService.deleteAddress(addressId);

      res.status(200).end();
    } catch (error) {
      next(ApiError.badRequest("При удалении адреса произошла ошибка", error));
    }
  };
}

export const userController = new UserController();
