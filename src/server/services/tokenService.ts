import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";
import { Token } from "../models/Token";
import type { UserDto } from "../dtos/userDto";
import {
  GUEST_TOKEN_EXPIRES_DAYS,
  REFRESH_TOKEN_EXPIRES_DAYS,
} from "../../helpers/constants";
import * as process from "process";
import { ApiError } from "../error/ApiError";

class TokenService {
  generateTokens(userDto: UserDto) {
    const accessToken = jwtSign({ ...userDto }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "30m",
    });

    if (userDto.role === "GUEST") {
      const guestToken = jwtSign({ ...userDto }, process.env.JWT_GUEST_SECRET, {
        expiresIn: `${GUEST_TOKEN_EXPIRES_DAYS}d`,
      });

      return { accessToken, guestToken };
    } else {
      const refreshToken = jwtSign(
        { ...userDto },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: `${REFRESH_TOKEN_EXPIRES_DAYS}d`,
        }
      );

      return { accessToken, refreshToken };
    }
  }

  async saveToken(userId: number, serverToken: string) {
    if (!userId) {
      throw ApiError.badRequest(
        "Для сохранения токена обновления не был предоставлен ID пользователя"
      );
    }

    const token = await Token.findOne({ where: { userId } });

    let updatedToken: Token;
    if (!token) {
      updatedToken = await Token.create({ userId, serverToken });
    } else {
      updatedToken = await token.update({ serverToken });
    }

    return updatedToken;
  }

  async removeToken(serverToken: string) {
    return Token.destroy({ where: { serverToken } });
  }

  validateAccessToken(accessToken: string) {
    try {
      // noinspection JSVoidFunctionReturnValueUsed
      return jwtVerify(accessToken, process.env.JWT_ACCESS_SECRET) as UserDto;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(refreshToken: string) {
    try {
      // noinspection JSVoidFunctionReturnValueUsed
      return jwtVerify(refreshToken, process.env.JWT_REFRESH_SECRET) as UserDto;
    } catch (error) {
      return null;
    }
  }

  validateGuestToken(guestToken: string) {
    try {
      // noinspection JSVoidFunctionReturnValueUsed
      return jwtVerify(guestToken, process.env.JWT_GUEST_SECRET) as UserDto;
    } catch (error) {
      return null;
    }
  }

  async getRefreshTokenNote(serverToken: string) {
    if (!serverToken) {
      throw ApiError.badRequest(
        "Для получения записи токена обновления не был предоставлен токен обновления"
      );
    }

    return await Token.findOne({ where: { serverToken } });
  }
}

export const tokenService = new TokenService();
