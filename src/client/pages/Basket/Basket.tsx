import React from "react";
import { Text } from "../../components/ui/Text";
import { useGetBasketQuery } from "../../store/slices/basketApiSlice";
import { isApiError } from "../../utils/isApiError";
import { Indent } from "../../components/ui/Indent";
import { BasketProduct } from "./BasketProduct";
import { useAppSelector } from "../../store/helpers/hooks";
import { selectUser } from "../../store/slices/userSlice";

export const Basket = () => {
  const { isAuth: isCurrentUserAuth } = useAppSelector(selectUser);
  const { data, isLoading, isSuccess, isError, error } = useGetBasketQuery(
    undefined,
    { skip: !isCurrentUserAuth }
  );

  if (!isCurrentUserAuth) {
    return <Text>Для просмотра корзины необходима авторизация</Text>;
  }

  if (isError) {
    if ("data" in error && isApiError(error.data)) {
      return <Text>{error.data.message}</Text>;
    }

    console.log({ error });

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
