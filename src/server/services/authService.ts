import type { UserCreationAttributesWithAssociations } from "../models/User";
import { User } from "../models/User";
import { Basket } from "../models/Basket";
import { Wishlist } from "../models/Wishlist";
import { Address } from "../models/Address";
import bcrypt from "bcrypt";
import { mailService } from "./mailService";
import { tokenService } from "./tokenService";
import { UserDto } from "../dtos/userDto";
import { sequelize } from "../database";
import { ApiError } from "../error/ApiError";
import { nanoid } from "@reduxjs/toolkit";

export type CreateUserData =
  UserCreationAttributesWithAssociations<"addresses"> &
    Partial<
      Pick<
        UserCreationAttributesWithAssociations<"basket" | "wishlist">,
        "basket" | "wishlist"
      >
    >;

export type UserAuthData = {
  user: UserDto;
  accessToken: string;
} & ({ refreshToken: string } | { guestToken: string });

class AuthService {
  private async generateAuthData<U extends User>(
    user: U
  ): Promise<UserAuthData> {
    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens(userDto);
    await tokenService.saveToken(
      user.id,
      tokens.refreshToken ?? tokens.guestToken
    );

    return { user: userDto, ...tokens };
  }

  public async registration(data: CreateUserData) {
    const { role: _role, ...userData } = data; // Prevent registration Admins

    return sequelize.transaction(async () => {
      const user = await User.create(
        {
          basket: {},
          wishlist: {},
          ...userData,
        },
        { include: [Basket, Wishlist, Address] }
      );

      await mailService.sendActivationMail(user.email, user.password);

      return await this.generateAuthData(user);
    });
  }

  public async login(email: string, password: string) {
    return sequelize.transaction(async () => {
      const user = await this.getOneUserByEmail(email);

      const isPasswordEqual = bcrypt.compareSync(
        email + password.toString(),
        user.password
      );

      if (!isPasswordEqual) {
        throw ApiError.badRequest("Указан неверный пароль");
      }

      return await this.generateAuthData(user);
    });
  }

  public async refresh(
    refreshToken: string | undefined,
    guestToken: string | undefined
  ) {
    // refresh token present
    if (refreshToken) {
      const userDto = tokenService.validateRefreshToken(refreshToken);
      const refreshTokenNote = await tokenService.getRefreshTokenNote(
        refreshToken
      );

      if (!userDto || !refreshTokenNote) {
        throw ApiError.unauthorized();
      }

      const user = await this.getOneUserById(userDto.id);
      return await this.generateAuthData(user);
    }

    // guest token present without refresh token
    if (guestToken) {
      const userDto = tokenService.validateGuestToken(guestToken);
      const refreshTokenNote = await tokenService.getRefreshTokenNote(
        guestToken
      );

      // guest token valid, return auth guest data
      if (userDto && refreshTokenNote) {
        const user = await this.getOneUserById(userDto.id);
        return await this.generateAuthData(user);
      }

      // guest token invalid, create new guest user
      // todo maybe delete invalid guest user
    }

    // creating new guest user
    const user = await User.create(
      {
        basket: {},
        wishlist: {},
        role: "GUEST",
        password: nanoid(20),
      },
      { include: [Basket, Wishlist] }
    );

    return await this.generateAuthData(user);
  }

  public async logout(refreshToken: string) {
    return await tokenService.removeToken(refreshToken);
  }

  public async activate(encodedActivationLink: string) {
    if (!encodedActivationLink) {
      throw ApiError.badRequest(
        "Для активации аккаунта не была предоставлена ссылка активации"
      );
    }

    const activationLink = decodeURIComponent(encodedActivationLink);

    const user = await User.findOne({ where: { password: activationLink } });

    if (!user) {
      throw ApiError.badRequest(
        `Пользователь с activationLink - ${activationLink} не найден`
      );
    }

    return await user.update({ isActivated: true });
  }

  private async getOneUserById(id: number) {
    if (!id) {
      throw ApiError.badRequest(
        "Для получения пользователя не был предоставлен id"
      );
    }

    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw ApiError.badRequest(`Пользователь с id - ${id} не найден`);
    }

    return user;
  }

  private async getOneUserByEmail(email: string) {
    if (!email) {
      throw ApiError.badRequest(
        "Для получения пользователя не был предоставлен email"
      );
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw ApiError.badRequest(`Пользователь с email - ${email} не найден`);
    }

    return user;
  }
}

export const authService = new AuthService();
