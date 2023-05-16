import React from "react";
import { Text } from "../../components/ui/Text";
import { useGetBasketQuery } from "../../store/slices/basketApiSlice";
import { isApiError } from "../../utils/isApiError";
import { Indent } from "../../components/ui/Indent";
import { BasketProduct } from "./BasketProduct";

export const Basket = () => {
  const { data, isLoading, isSuccess, isError, error } = useGetBasketQuery();

  if (isError) {
    if (isApiError(error)) {
      return <Text>{error.data.message}</Text>;
    }

    return <Text>Ошибка</Text>;
  }

  if (isLoading) {
    return <Text>Загрузка ...</Text>;
  }

  if (!isSuccess) {
    return <Text>Не удалось загрузить корзину</Text>;
  }

  return (
    <>
      {data.basket.basketProducts.map(({ product }, index) => (
        <div key={product.id}>
          <BasketProduct productId={product.id} />
          {index !== data.basket.basketProducts.length - 1 && (
            <Indent size={3} />
          )}
        </div>
      ))}
      <Indent size={3} />
      <Text as="div" textSize={2}>
        Подытог: {data.subtotal}
      </Text>
      <Indent size={3} />
      <Text as="div" textSize={2}>
        Итог: {data.total}
      </Text>
    </>
  );
};
