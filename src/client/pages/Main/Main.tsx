import React from "react";
import styles from "./main.module.css";
import { Text } from "../../components/ui/Text";
import { useGetProductsQuery } from "../../store/slices/productsApiSlice";
import { Card } from "../../components/ui/Card";
import { Indent } from "../../components/ui/Indent";
import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { stopPropagation } from "../../utils/react/stopPropagation";
import { preventDefault } from "../../utils/react/preventDefault";
import { isApiError } from "../../utils/isApiError";

export const Main = () => {
  const {
    data: products,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetProductsQuery();

  if (isLoading) {
    return <Text>Загрузка ...</Text>;
  }

  if (!isSuccess) {
    if (isError && isApiError(error)) {
      return <Text>{error.data.message}</Text>;
    }
    return <Text>Ошибка</Text>;
  }

  return (
    <div className={styles.productsList}>
      {products.rows.map((product) => (
        <Link to={`${product.id}`} key={product.id}>
          <Card cardColor="venusSlipperOrchid" className={styles.productCard}>
            <img
              src={"static/productImages/" + product.productImages[0].url}
              alt={product.productImages[0].description}
            />
            <Indent size={3} />
            <Text as="h2" textSize={4} textWeight="bold">
              {product.name}
            </Text>
            <Indent size={3} />

            <Button
              btnColor="tunicGreen"
              textSize={4}
              onClick={preventDefault(stopPropagation(() => {}))}
            >
              <div className={styles.priceBlock}>
                <Text>В корзину</Text>
                <Indent size={3} inline />
                <Text>{product.price}₽</Text>
              </div>
            </Button>
          </Card>
        </Link>
      ))}
    </div>
  );
};
