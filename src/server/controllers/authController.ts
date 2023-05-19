import type { RequestHandler, Response } from "express";
import { ApiError } from "../error/ApiError";
import type { CreateUserData, UserAuthData } from "../services/authService";
import { authService } from "../services/authService";
import {
  GUEST_TOKEN_EXPIRES_DAYS,
  REFRESH_TOKEN_EXPIRES_DAYS,
} from "../../helpers/constants";

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

  #clearRefreshCookie(res: Response) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }

  #setGuestCookie(res: Response, guestToken: string) {
    res.cookie("guestToken", guestToken, {
      maxAge: GUEST_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
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
      const { accessToken, user, ...serverToken } =
        await authService.registration(req.body);

      if (!("refreshToken" in serverToken)) {
        return next(ApiError.unauthorized());
      }

      this.#setRefreshCookie(res, serverToken.refreshToken);

      res.status(200).json({ user, accessToken });
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
      const { accessToken, user, ...serverToken } = await authService.login(
        req.body.email,
        req.body.password
      );

      if (!("refreshToken" in serverToken)) {
        return next(ApiError.unauthorized());
      }

      this.#setRefreshCookie(res, serverToken.refreshToken);

      res.status(200).json({ user, accessToken });
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
      this.#clearRefreshCookie(res);

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
      const { refreshToken: cookieRefreshToken, guestToken: cookieGuestToken } =
        req.cookies as {
          refreshToken: string | undefined;
          guestToken: string | undefined;
        };

      const { accessToken, user, ...serverToken } = await authService.refresh(
        cookieRefreshToken,
        cookieGuestToken
      );

      if ("guestToken" in serverToken) {
        this.#setGuestCookie(res, serverToken.guestToken);
        this.#clearRefreshCookie(res);
      } else {
        this.#setRefreshCookie(res, serverToken.refreshToken);
      }

      res.status(200).json({ user, accessToken });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        this.#clearRefreshCookie(res);

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
