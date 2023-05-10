import type { Response, RequestHandler } from "express";
import { ApiError } from "../error/ApiError";
import type {
  CreateAddressData,
  CreateUserData,
  UpdateAddressData,
  UserAuthData,
} from "../services/userService";
import { userService } from "../services/userService";
import type { Address } from "../models/Address";
import { parseAppInt } from "../../helpers/parseAppInt";
import { REFRESH_TOKEN_EXPIRES_DAYS } from "../../helpers/constants";
import * as process from "process";

export type RegistrationUserBody = CreateUserData;
export type RegistrationUserResponse = Omit<UserAuthData, "refreshToken">;

export type LoginUserBody = { email: string; password: string };
export type LoginUserResponse = Omit<UserAuthData, "refreshToken">;

export type RefreshUserResponse = Omit<UserAuthData, "refreshToken">;

export type CreateAddressBody = CreateAddressData;
export type UpdateAddressBody = UpdateAddressData;

class UserController {
  #setRefreshCookie(res: Response, refreshToken: string) {
    res.cookie("refreshToken", refreshToken, {
      maxAge: REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }

  registration: RequestHandler<
    void,
    RegistrationUserResponse,
    RegistrationUserBody,
    void
  > = async (req, res, next) => {
    try {
      const { refreshToken, ...userData } = await userService.registration(
        req.body
      );

      this.#setRefreshCookie(res, refreshToken);

      res.status(200).json(userData);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
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
      const { refreshToken, ...userData } = await userService.login(
        req.body.email,
        req.body.password
      );
      this.#setRefreshCookie(res, refreshToken);

      res.status(200).json(userData);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При входе в аккаунт произошла ошибка",
          error
        )
      );
    }
  };

  logout: RequestHandler<void, void, void, void> = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies as { refreshToken: string };
      await userService.logout(refreshToken);
      res.clearCookie("refreshToken");

      res.status(200).end();
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При выходе из аккаунта произошла ошибка",
          error
        )
      );
    }
  };

  refresh: RequestHandler<void, RefreshUserResponse, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const { refreshToken: cookieRefreshToken } = req.cookies as {
        refreshToken: string;
      };
      const { refreshToken, ...userData } = await userService.refresh(
        cookieRefreshToken
      );
      this.#setRefreshCookie(res, refreshToken);

      res.status(200).json(userData);
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При обновлении токена произошла ошибка",
          error
        )
      );
    }
  };

  activate: RequestHandler<{ link: string }, void, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      await userService.activate(req.params.link);

      res.redirect("/");
    } catch (error) {
      next(
        ApiError.setDefaultMessage(
          "При активации аккаунта произошла ошибка",
          error
        )
      );
    }
  };

  // todo delete
  // check: RequestHandler<
  //   void,
  //   { accessToken: string; refreshToken: string },
  //   void,
  //   void
  // > = async (req, res, next) => {
  //   try {
  //     const tokens = tokenService.generateTokens(req.user);
  //     res.status(200).json(tokens);
  //   } catch (error) {
  //     next(
  //       ApiError.setDefaultMessage(
  //         "При получении токенов произошла ошибка",
  //         error
  //       )
  //     );
  //   }
  // };

  createAddress: RequestHandler<void, Address, CreateAddressBody, void> =
    async (req, res, next) => {
      try {
        const address = await userService.createAddress(req.body);

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

  updateAddress: RequestHandler<
    { id: string },
    Address,
    UpdateAddressBody,
    void
  > = async (req, res, next) => {
    try {
      const addressId = parseAppInt(req.params.id);

      const address = await userService.updateAddress(addressId, req.body);

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
      const addressId = parseAppInt(req.params.id);

      await userService.deleteAddress(addressId);

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
