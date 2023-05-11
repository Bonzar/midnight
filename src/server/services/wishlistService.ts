import { WishlistProduct } from "../models/WishlistProduct";
import { Wishlist } from "../models/Wishlist";
import { Product } from "../models/Product";
import { ProductImage } from "../models/ProductImage";
import { ApiError } from "../error/ApiError";
import { sequelize } from "../database";

class WishlistService {
  private async getOneWishlist(userId: number) {
    if (!userId) {
      throw ApiError.badRequest(
        "Для получения списка желаний не был предоставлен ID пользователя"
      );
    }

    const wishlist = await Wishlist.findOne({ where: { userId } });

    if (!wishlist) {
      throw ApiError.badRequest(
        `Список желаний с id пользователя - ${userId} не найден`
      );
    }

    return wishlist;
  }

  public async getOneDetailedWishlist(userId: number) {
    if (!userId) {
      throw ApiError.badRequest(
        "Для получения списка желаний не был предоставлен ID пользователя"
      );
    }

    const wishlist = await Wishlist.findOne({
      where: { userId },
      include: [
        {
          model: WishlistProduct,
          include: [
            {
              model: Product,
              include: [
                { model: ProductImage, limit: 1, order: [["sort", "ASC"]] },
              ],
            },
          ],
        },
      ],
    });

    if (!wishlist) {
      throw ApiError.badRequest(
        `Список желаний с id пользователя - ${userId} не найден`
      );
    }

    return wishlist;
  }

  public async addProduct(userId: number, productId: number) {
    if (typeof productId === "undefined" || typeof userId === "undefined") {
      throw ApiError.badRequest(
        `Для добавления товара в список желаний не был предоставлен ID: ${[
          typeof productId === "undefined" && "товара",
          typeof userId === "undefined" && "пользователя",
        ]
          .filter(Boolean)
          .join(", ")}`
      );
    }

    return await sequelize.transaction(async () => {
      const wishlist = await this.getOneWishlist(userId);

      return await WishlistProduct.create({
        wishlistId: wishlist.id,
        productId,
      });
    });
  }

  private async getOneProduct(wishlistId: number, productId: number) {
    if (typeof productId === "undefined" || typeof wishlistId === "undefined") {
      throw ApiError.badRequest(
        `Для получения товара из списка желаний не был предоставлен ID: ${[
          typeof productId === "undefined" && "товара",
          typeof wishlistId === "undefined" && "списка желаний",
        ]
          .filter(Boolean)
          .join(", ")}`
      );
    }

    const wishlistProductNote = await WishlistProduct.findOne({
      where: { productId, wishlistId },
    });

    if (!wishlistProductNote) {
      throw ApiError.badRequest(
        `Запись о товаре в списке желаний с идентификаторами: id списка желаний - ${wishlistId}, id товара - ${productId} — не найдена`
      );
    }

    return wishlistProductNote;
  }

  public async deleteProduct(userId: number, productId: number) {
    return await sequelize.transaction(async () => {
      const wishlist = await this.getOneWishlist(userId);

      const wishlistProductNote = await this.getOneProduct(
        wishlist.id,
        productId
      );

      return await wishlistProductNote.destroy();
    });
  }
}

export const wishlistService = new WishlistService();
