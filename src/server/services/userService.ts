import type { UserCreationAttributes } from "../models/User";
import { User } from "../models/User";
import { Basket } from "../models/Basket";
import { Wishlist } from "../models/Wishlist";
import type { AddressCreationAttributes } from "../models/Address";
import { Address } from "../models/Address";

export type CreateUserData = UserCreationAttributes;
export type CreateAddressData = AddressCreationAttributes;
export type UpdateAddressData = Partial<AddressCreationAttributes>;

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

  async getOne(id: number) {
    if (!id) {
      throw new Error("Для получения пользователя не был предоставлен ID");
    }

    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw new Error(`Пользователь с id - ${id} не найден`);
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
