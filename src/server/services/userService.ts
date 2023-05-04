import type { UserCreationAttributes } from "../models/User";
import { User } from "../models/User";
import { Basket } from "../models/Basket";
import { Wishlist } from "../models/Wishlist";
import type { AddressCreationAttributes } from "../models/Address";
import { Address } from "../models/Address";
import { sign as jwtSign } from "jsonwebtoken";
import bcrypt from "bcrypt";

export type CreateUserData = UserCreationAttributes;
export type CreateAddressData = AddressCreationAttributes;
export type UpdateAddressData = Partial<AddressCreationAttributes>;

export type UserJwtPayload = { id: number; email: string; role: User["role"] };

class UserService {
  generateJwt(id: number, email: string, role: User["role"]) {
    const payload: UserJwtPayload = { id, email, role };

    return jwtSign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
  }

  async registration(data: UserCreationAttributes) {
    const user = await User.create(
      {
        basket: {},
        wishlist: {},
        ...data,
      },
      { include: [Basket, Wishlist, Address] }
    );

    const jwt = this.generateJwt(user.id, user.email, user.role);

    const userData = Object.assign(user, {
      password: undefined,
    }) as Omit<User, "password">;

    return { user: userData, token: jwt };
  }

  async login(email: string, password: string) {
    const user = await this.getOne(email);

    const comparePassword = bcrypt.compareSync(
      email + password.toString(),
      user.password
    );

    if (!comparePassword) {
      throw new Error("Указан неверный пароль");
    }

    const jwt = this.generateJwt(user.id, user.email, user.role);

    const userData = Object.assign(user, {
      password: undefined,
    }) as Omit<User, "password">;

    return { user: userData, token: jwt };
  }

  async getOne(email: string) {
    if (!email) {
      throw new Error("Для получения пользователя не был предоставлен email");
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error(`Пользователь с email - ${email} не найден`);
    }

    return user;
  }

  async createAddress(data: CreateAddressData) {
    return await Address.create(data);
  }

  async getOneAddress(id: number) {
    if (!id) {
      throw new Error("Для получения адреса не был предоставлен ID");
    }

    const address = await Address.findOne({ where: { id } });

    if (!address) {
      throw new Error(`Адрес с id - ${id} не найден`);
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
