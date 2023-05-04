import type { Wishlist } from "../models/Wishlist";
import type { RequestHandler } from "express";
import { ApiError } from "../error/ApiError";
import { wishlistService } from "../services/wishlistService";
import { parseInt } from "../../helpers/parseInt";
import type { WishlistProduct } from "../models/WishlistProduct";

export type AddWishlistProductBody = { wishlistId: number; productId: number };
export type DeleteWishlistProductBody = {
  wishlistId: number;
  productId: number;
};

class WishlistController {
  getWishlist: RequestHandler<{ id: string }, Wishlist, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const wishlistId = parseInt(req.params.id);

      const wishlist = await wishlistService.getOneWishlist(wishlistId);

      res.status(200).json(wishlist);
    } catch (error) {
      next(
        ApiError.badRequest(
          "При получении списка желаний произошла ошибка",
          error
        )
      );
    }
  };

  addProduct: RequestHandler<
    void,
    WishlistProduct,
    AddWishlistProductBody,
    void
  > = async (req, res, next) => {
    try {
      const wishlistProductNote = await wishlistService.addProduct(
        req.body.wishlistId,
        req.body.productId
      );

      res.status(200).json(wishlistProductNote);
    } catch (error) {
      next(
        ApiError.badRequest(
          "При добавлении товара в список желаний произошла ошибка",
          error
        )
      );
    }
  };

  deleteProduct: RequestHandler<void, void, DeleteWishlistProductBody, void> =
    async (req, res, next) => {
      try {
        await wishlistService.deleteProduct(
          req.body.wishlistId,
          req.body.productId
        );

        res.status(200).end();
      } catch (error) {
        next(
          ApiError.badRequest(
            "При удалении товара из списка желаний произошла ошибка",
            error
          )
        );
      }
    };
}

export const wishlistController = new WishlistController();
