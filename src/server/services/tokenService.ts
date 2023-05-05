import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";
import { Token } from "../models/Token";
import type { UserDto } from "../dtos/userDto";
import { REFRESH_TOKEN_EXPIRES_DAYS } from "../../helpers/constants";
import * as process from "process";
import { ApiError } from "../error/ApiError";

class TokenService {
  generateTokens(userDto: UserDto) {
    const accessToken = jwtSign({ ...userDto }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "30m",
    });
    const refreshToken = jwtSign(
      { ...userDto },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: `${REFRESH_TOKEN_EXPIRES_DAYS}d`,
      }
    );

    return { accessToken, refreshToken };
  }

  async saveToken(userId: number, refreshToken: string) {
    if (!userId) {
      throw ApiError.badRequest(
        "Для сохранения токена обновления не был предоставлен ID пользователя"
      );
    }

    const token = await Token.findOne({ where: { userId } });

    let updatedToken: Token;
    if (!token) {
      updatedToken = await Token.create({ userId, refreshToken });
    } else {
      updatedToken = await token.update({ refreshToken });
    }

    return updatedToken;
  }

  async removeToken(refreshToken: string) {
    return Token.destroy({ where: { refreshToken } });
  }

  validateAccessToken(token: string) {
    try {
      return jwtVerify(token, process.env.JWT_ACCESS_SECRET) as UserDto;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      return jwtVerify(token, process.env.JWT_REFRESH_SECRET) as UserDto;
    } catch (error) {
      return null;
    }
  }

  async getRefreshTokenNote(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.badRequest(
        "Для получения записи токена обновления не был предоставлен токен обновления"
      );
    }

    return await Token.findOne({ where: { refreshToken } });
  }
}

export const tokenService = new TokenService();
