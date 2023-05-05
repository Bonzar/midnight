import { WishlistProduct } from "../models/WishlistProduct";
import { Wishlist } from "../models/Wishlist";
import { Product } from "../models/Product";
import { ProductImage } from "../models/ProductImage";
import { ApiError } from "../error/ApiError";

class WishlistService {
  private checkIdsPresent(
    wishlistId: number,
    productId: number,
    messageAction: string
  ) {
    if (typeof productId === "undefined" || typeof wishlistId === "undefined") {
      throw ApiError.badRequest(
        `Для ${messageAction} не был предоставлен ID: ${[
          typeof productId === "undefined" && "товара",
          typeof wishlistId === "undefined" && "списка желаний",
        ]
          .filter(Boolean)
          .join(", ")}`
      );
    }
  }

  async getOneWishlist(id: number) {
    if (!id) {
      throw ApiError.badRequest(
        "Для получения списка желаний не был предоставлен ID"
      );
    }

    const wishlist = await Wishlist.findOne({
      where: { id },
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
      throw ApiError.badRequest(`Список желаний с id - ${id} не найден`);
    }

    return wishlist;
  }

  async addProduct(wishlistId: number, productId: number) {
    this.checkIdsPresent(
      wishlistId,
      productId,
      "добавления товара в список желаний"
    );

    return await WishlistProduct.create({ wishlistId, productId });
  }

  async getOneProduct(wishlistId: number, productId: number) {
    this.checkIdsPresent(
      wishlistId,
      productId,
      "получения товара из списка желаний"
    );

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

  async deleteProduct(wishlistId: number, productId: number) {
    const wishlistProductNote = await this.getOneProduct(wishlistId, productId);

    return await wishlistProductNote.destroy();
  }
}

export const wishlistService = new WishlistService();
