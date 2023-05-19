import React from "react";
import styles from "./main.module.css";
import { Text } from "../../components/ui/Text";
import { useGetProductsQuery } from "../../store/slices/productsApiSlice";
import { Card } from "../../components/ui/Card";
import { Indent } from "../../components/ui/Indent";
import { Link } from "react-router-dom";
import { isApiError } from "../../utils/isApiError";
import { AddToCardButton } from "../../components/AddToCardButton";

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
    if (isError && "data" in error && isApiError(error.data)) {
      return <Text>{error.data.message}</Text>;
    }
    return <Text>Ошибка</Text>;
  }

  return (
    <div className={styles.productsList}>
      {products.rows.map((product) => (
        <Link to={`products/${product.id}`} key={product.id}>
          <Card cardColor="venusSlipperOrchid" className={styles.productCard}>
            <img
              src={"/static/productImages/" + product.productImages.at(0)?.url}
              alt={product.productImages.at(0)?.description}
            />
            <Indent size={3} />
            <Text as="h2" textSize={4} textWeight="bold">
              {product.name}
            </Text>
            <Indent size={3} />
            <AddToCardButton price={product.price} productId={product.id} />
          </Card>
        </Link>
      ))}
    </div>
  );
};
