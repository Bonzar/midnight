import type { UserCreationAttributes } from "../models/User";
import { User } from "../models/User";
import { Basket } from "../models/Basket";
import { Wishlist } from "../models/Wishlist";
import type { AddressCreationAttributes } from "../models/Address";
import { Address } from "../models/Address";
import bcrypt from "bcrypt";
import { mailService } from "./mailService";
import { tokenService } from "./tokenService";
import { UserDto } from "../dtos/userDto";
import { sequelize } from "../database";
import { ApiError } from "../error/ApiError";

export type CreateUserData = UserCreationAttributes;
export type CreateAddressData = AddressCreationAttributes;
export type UpdateAddressData = Partial<AddressCreationAttributes>;
export interface UserAuthData {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}

class UserService {
  private async generateAuthData(user: User): Promise<UserAuthData> {
    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens(userDto);
    await tokenService.saveToken(user.id, tokens.refreshToken);

    return { user: userDto, ...tokens };
  }

  async registration(data: CreateUserData) {
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

  async login(email: string, password: string) {
    return sequelize.transaction(async () => {
      const user = await this.getOneByEmail(email);

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

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.unauthorized(
        new Error("Для обновления токена не был предоставлен токен обновления")
      );
    }

    const userDto = tokenService.validateRefreshToken(refreshToken);
    const refreshTokenNote = await tokenService.getRefreshTokenNote(
      refreshToken
    );
    if (!userDto || !refreshTokenNote) {
      throw ApiError.unauthorized();
    }

    const user = await this.getOneByEmail(userDto.email);

    return await this.generateAuthData(user);
  }

  async logout(refreshToken: string) {
    return await tokenService.removeToken(refreshToken);
  }

  async activate(activationLink: string) {
    if (!activationLink) {
      throw ApiError.badRequest(
        "Для активации аккаунта не была предоставлена ссылка активации"
      );
    }

    const user = await User.findOne({ where: { password: activationLink } });

    if (!user) {
      throw ApiError.badRequest(
        `Пользователь с activationLink - ${activationLink} не найден`
      );
    }

    return await user.update({ isActivated: true });
  }

  async getOneByEmail(email: string) {
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

  async createAddress(data: CreateAddressData) {
    return await Address.create(data);
  }

  async getOneAddress(id: number) {
    if (!id) {
      throw ApiError.badRequest("Для получения адреса не был предоставлен ID");
    }

    const address = await Address.findOne({ where: { id } });

    if (!address) {
      throw ApiError.badRequest(`Адрес с id - ${id} не найден`);
    }

    return address;
  }

  async updateAddress(id: number, updateData: UpdateAddressData) {
    const address = await this.getOneAddress(id);

    return address.update(updateData);
  }

  async deleteAddress(id: number) {
    const address = await this.getOneAddress(id);

    return await address.destroy();
  }
}

export const userService = new UserService();
