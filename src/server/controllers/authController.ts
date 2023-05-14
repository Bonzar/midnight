import type { RequestHandler, Response } from "express";
import { ApiError } from "../error/ApiError";
import type { CreateUserData, UserAuthData } from "../services/authService";
import { authService } from "../services/authService";
import { REFRESH_TOKEN_EXPIRES_DAYS } from "../../helpers/constants";

export type RegistrationUserBody = CreateUserData;
export type RegistrationUserResponse = Omit<UserAuthData, "refreshToken">;

export type LoginUserBody = { email: string; password: string };
export type LoginUserResponse = Omit<UserAuthData, "refreshToken">;

export type RefreshUserResponse = Omit<UserAuthData, "refreshToken">;

class AuthController {
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
      const { refreshToken, ...userData } = await authService.registration(
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
      const { refreshToken, ...userData } = await authService.login(
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
      await authService.logout(refreshToken);
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
      const { refreshToken, ...userData } = await authService.refresh(
        cookieRefreshToken
      );
      this.#setRefreshCookie(res, refreshToken);

      res.status(200).json(userData);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        return next(error);
      }

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
      await authService.activate(req.params.link);

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
}

export const authController = new AuthController();
