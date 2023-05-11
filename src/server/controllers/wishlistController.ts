import type { WishlistAttributesWithAssociations } from "../models/Wishlist";
import type { RequestHandler } from "express";
import { ApiError } from "../error/ApiError";
import { wishlistService } from "../services/wishlistService";
import { parseAppInt } from "../../helpers/parseAppInt";
import type {
  WishlistProductAttributes,
  WishlistProductAttributesWithAssociations,
} from "../models/WishlistProduct";
import type { ProductAttributesWithAssociations } from "../models/Product";

export type GetWishlistResponse = WishlistAttributesWithAssociations<
  never,
  {
    wishlistProducts: WishlistProductAttributesWithAssociations<
      never,
      {
        product: ProductAttributesWithAssociations<"productImages">;
      }
    >[];
  }
>;

export type AddWishlistProductBody = { wishlistId: number; productId: number };
export type AddWishlistProductResponse = WishlistProductAttributes;

export type DeleteWishlistProductBody = {
  wishlistId: number;
  productId: number;
};

class WishlistController {
  getWishlist: RequestHandler<{ id: string }, GetWishlistResponse, void, void> =
    async (req, res, next) => {
      try {
        const wishlistId = parseAppInt(req.params.id);

        const wishlist = await wishlistService.getOneWishlist(wishlistId);

        res.status(200).json(wishlist);
      } catch (error) {
        next(
          ApiError.setDefaultMessage(
            "При получении списка желаний произошла ошибка",
            error
          )
        );
      }
    };

  addProduct: RequestHandler<
    void,
    AddWishlistProductResponse,
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
        ApiError.setDefaultMessage(
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
          ApiError.setDefaultMessage(
            "При удалении товара из списка желаний произошла ошибка",
            error
          )
        );
      }
    };
}

export const wishlistController = new WishlistController();
