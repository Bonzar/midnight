import React from "react";
import styles from "./product.module.css";
import { Text } from "../../components/ui/Text";
import { useParams } from "react-router-dom";
import { useGetDetailedProductQuery } from "../../store/slices/productsApiSlice";
import { parseAppInt } from "../../../helpers/parseAppInt";
import { Indent } from "../../components/ui/Indent";
import { Card } from "../../components/ui/Card";
import { isApiError } from "../../utils/isApiError";
import { AddToCardButton } from "../../components/AddToCardButton";

export const Product = () => {
  const { id: paramsId } = useParams<"id">();
  const id = paramsId ? parseAppInt(paramsId) : null;

  const { data, isSuccess, isLoading, isError, error } =
    useGetDetailedProductQuery(id ?? 0, {
      skip: !id,
    });

  if (isError) {
    if ("data" in error && isApiError(error.data)) {
      return <Text>{error.data.message}</Text>;
    }

    return <Text>Ошибка</Text>;
  }

  if (isLoading) {
    return <Text>Загрузка</Text>;
  }

  if (!isSuccess) {
    return <Text>Не получилось</Text>;
  }

  const product = data;

  return (
    <div className={styles.productPage}>
      <div // Image Slider
      >
        {product.productImages.length > 0 &&
          product.productImages.map((image) => (
            <>
              <img
                src={"/static/productImages/" + image.url}
                alt={image.description}
              />
              <Indent size={3} />
            </>
          ))}
      </div>

      <Card cardColor="venusSlipperOrchid">
        <Text as="h2" textWeight="bold">
          {product.name}
        </Text>
        <Indent size={3} />

        <AddToCardButton price={product.price} productId={product.id} />
      </Card>
    </div>
  );
};
