import type { UserAttributes } from "../models/User";
import { User } from "../models/User";
import type {
  AddressAttributes,
  AddressCreationAttributes,
} from "../models/Address";
import { Address } from "../models/Address";
import { ApiError } from "../error/ApiError";
import { checkIdsPresent } from "../helpers/checkIdsPresent";
import type { Includeable } from "sequelize";

export type UpdateUserData = Omit<
  Partial<UserAttributes>,
  "email" | "password" | "isActivated" | "role"
>;

export type CreateAddressData = Omit<AddressCreationAttributes, "userId">;

export type UpdateAddressData = Omit<AddressAttributes, "userId">;

class UserService {
  private async getOneUser(
    userId: number,
    include?: Includeable | Includeable[]
  ) {
    if (!userId) {
      throw ApiError.badRequest(
        "Для получения пользователя не был предоставлен id"
      );
    }

    const user = await User.findOne({ where: { id: userId }, include });

    if (!user) {
      throw ApiError.badRequest(`Пользователь с id - ${userId} не найден`);
    }

    return user;
  }

  public async getOneDetailedUser(userId: number) {
    return await this.getOneUser(userId, [Address]);
  }

  public async updateUser(userId: number, updateData: UpdateUserData) {
    // prevent updating sensitive data
    const {
      email: _email,
      password: _password,
      isActivated: _isActivated,
      role: _role,
      ...safeUpdateData
    } = updateData as typeof updateData &
      Record<"email" | "password" | "isActivated" | "role", never>;

    const user = await this.getOneUser(userId);

    return await user.update(safeUpdateData);
  }

  public async createAddress(userId: number, data: CreateAddressData) {
    if (!userId) {
      throw ApiError.badRequest(
        "Для сохранения адреса не был предоставлен ID пользователя"
      );
    }

    return await Address.create({ ...data, userId });
  }

  public async getOneAddress(userId: number, addressId: number) {
    this.checkIdsPresentAddress(userId, addressId, "получения адреса");

    const address = await Address.findOne({ where: { id: addressId, userId } });

    if (!address) {
      throw ApiError.badRequest(
        `Адрес с id - ${addressId}, у пользователя с id - ${userId}, не найден`
      );
    }

    return address;
  }

  public async updateAddress(
    userId: number,
    addressId: number,
    updateData: UpdateAddressData
  ) {
    this.checkIdsPresentAddress(userId, addressId, "обновления адреса");

    const address = await this.getOneAddress(userId, addressId);

    return address.update(updateData);
  }

  async deleteAddress(userId: number, addressId: number) {
    this.checkIdsPresentAddress(userId, addressId, "удаления адреса");

    const address = await this.getOneAddress(userId, addressId);

    return await address.destroy();
  }

  private checkIdsPresentAddress(
    userId: number,
    addressId: number,
    messageAction: string
  ) {
    try {
      checkIdsPresent(
        [
          { value: userId, whoseIdentifier: "пользователя" },
          { value: addressId, whoseIdentifier: "адреса" },
        ],
        messageAction
      );
    } catch (error) {
      throw ApiError.badRequest(
        `При проверке идентификаторов для работы с адресом произошла ошибка`,
        error
      );
    }
  }
}

export const userService = new UserService();
