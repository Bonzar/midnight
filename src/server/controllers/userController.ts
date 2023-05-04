import type { RequestHandler } from "express";
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
type RegistrationUserResponse = { user: Omit<User, "password">; token: string };

type LoginUserBody = { email: string; password: string };
type LoginUserResponse = { user: Omit<User, "password">; token: string };

type CreateAddressBody = CreateAddressData;
type UpdateAddressBody = UpdateAddressData;

class UserController {
  registration: RequestHandler<
    void,
    RegistrationUserResponse,
    RegistrationUserBody,
    void
  > = async (req, res, next) => {
    try {
      const user = await userService.registration(req.body);

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

  login: RequestHandler<void, LoginUserResponse, LoginUserBody, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const user = await userService.login(req.body.email, req.body.password);

      res.status(200).json(user);
    } catch (error) {
      next(ApiError.badRequest("При входе в аккаунт произошла ошибка", error));
    }
  };

  check: RequestHandler<void, { token: string }, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const token = userService.generateJwt(
        req.user.id,
        req.user.email,
        req.user.role
      );

      res.status(200).json({ token });
    } catch (error) {
      next(ApiError.badRequest("При получении токена произошла ошибка", error));
    }
  };

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
