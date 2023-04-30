import { ProductMeta } from "../models/ProductMeta";
import type { IProductMetaCreationAttributes } from "../models/ProductMeta";
import type { RequestHandler } from "express";
import { ApiError } from "../error/ApiError";

type CreateProductMetaBody = IProductMetaCreationAttributes;
type UpdateProductMetaBody = Omit<
  Partial<IProductMetaCreationAttributes>,
  "id"
>;

class ProductMetaController {
  create: RequestHandler<void, ProductMeta, CreateProductMetaBody, void> =
    async (req, res, next) => {
      try {
        const newProductMeta = await ProductMeta.create(req.body);

        res.status(200).json(newProductMeta);
      } catch (error) {
        next(
          ApiError.badRequest("Ошибка создания характеристики товара", error)
        );
      }
    };

  update: RequestHandler<
    { id: number },
    ProductMeta,
    UpdateProductMetaBody,
    void
  > = async (req, res, next) => {
    try {
      const productMeta = await ProductMeta.findOne({
        where: { id: req.params.id },
      });

      if (!productMeta) {
        return next(
          ApiError.badRequest(
            `Характеристика товара с id - ${req.params.id} не найдена`
          )
        );
      }

      const updatedProductMeta = await productMeta.update(req.body);

      res.status(200).json(updatedProductMeta);
    } catch (error) {
      next(
        ApiError.badRequest("Ошибка обновления характеристики товара", error)
      );
    }
  };

  delete: RequestHandler<{ id: number }, void, void, void> = async (
    req,
    res,
    next
  ) => {
    try {
      const productMeta = await ProductMeta.findOne({
        where: { id: req.params.id },
      });

      if (!productMeta) {
        return next(
          ApiError.badRequest(
            `Характеристика товара с id - ${req.params.id} не найдена`
          )
        );
      }

      await productMeta.destroy();

      res.status(200).end();
    } catch (error) {
      next(ApiError.badRequest("Ошибка удаления характеристики товара", error));
    }
  };
}

export const productMetaController = new ProductMetaController();
