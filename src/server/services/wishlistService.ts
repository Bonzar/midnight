import { WishlistProduct } from "../models/WishlistProduct";
import { Wishlist } from "../models/Wishlist";
import { Product } from "../models/Product";
import { ProductImage } from "../models/ProductImage";

class WishlistService {
  private checkIdsPresent(
    wishlistId: number,
    productId: number,
    messageAction: string
  ) {
    if (typeof productId === "undefined" || typeof wishlistId === "undefined") {
      throw new Error(
        `Для ${messageAction} не был предоставлен ID: ${[
          typeof productId === "undefined" && "продукта",
          typeof wishlistId === "undefined" && "списка желаний",
        ]
          .filter(Boolean)
          .join(", ")}`
      );
    }
  }

  async getWishlist(id: number) {
    if (!id) {
      throw new Error("Для получения списка желаний не был предоставлен ID");
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
      throw new Error(`Список желаний с id - ${id} не найден`);
    }

    return wishlist;
  }

  async addProduct(wishlistId: number, productId: number) {
    this.checkIdsPresent(
      wishlistId,
      productId,
      "добавления продукта в список желаний"
    );

    return await WishlistProduct.create({ wishlistId, productId });
  }

  async getProduct(wishlistId: number, productId: number) {
    this.checkIdsPresent(
      wishlistId,
      productId,
      "получения продукта из списка желаний"
    );

    const wishlistProductNote = await WishlistProduct.findOne({
      where: { productId, wishlistId },
    });

    if (!wishlistProductNote) {
      throw new Error(
        `Запись о продукте в списке желаний с идентификаторами: id списка желаний - ${wishlistId}, id продукта - ${productId} — не найдена`
      );
    }

    return wishlistProductNote;
  }

  async deleteProduct(wishlistId: number, productId: number) {
    const wishlistProductNote = await this.getProduct(wishlistId, productId);

    return await wishlistProductNote.destroy();
  }
}

export const wishlistService = new WishlistService();
