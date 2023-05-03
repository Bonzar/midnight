import type { UserCreationAttributes } from "../models/User";
import { User } from "../models/User";
import { Basket } from "../models/Basket";
import { Wishlist } from "../models/Wishlist";
import { Address } from "../models/Address";
import type { Transaction } from "sequelize";

export type CreateUserData = UserCreationAttributes;

class UserService {
  async create(data: UserCreationAttributes) {
    return await User.create(
      {
        basket: {},
        wishlist: {},
        ...data,
      },
      { include: [Basket, Wishlist, Address] }
    );
  }

  async getOne(id: number, transaction?: Transaction) {
    if (!id) {
      throw new Error("Для получения пользователя не был предоставлен ID");
    }

    const user = await User.findOne({ where: { id }, transaction });

    if (!user) {
      throw new Error(`Пользователь с id - ${id} не найден`);
    }

    return user;
  }
}

export const userService = new UserService();
