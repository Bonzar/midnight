import React from "react";
import styles from "./main.module.css";
import { Text } from "../../components/ui/Text";
import { useGetProductsQuery } from "../../store/slices/productsApiSlice";
import { isApiError } from "../../utils/isApiError";
import { trackWindowScroll } from "react-lazy-load-image-component";
import { ProductCard } from "../../components/ProductCard";
import { Skeleton } from "../../components/ui/Skeleton";

export const Main = () => {
  const { data: products, isError, error, isSuccess } = useGetProductsQuery();

  if (isError) {
    if ("data" in error && isApiError(error.data)) {
      return <Text>{error.data.message}</Text>;
    }
    return <Text>Ошибка</Text>;
  }

  if (!isSuccess) return <Main.Skeleton />;

  const Gallery = trackWindowScroll(({ scrollPosition }) => (
    <div className={styles.productsList}>
      {products.rows.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          scrollPosition={scrollPosition}
        />
      ))}
    </div>
  ));

  return <Gallery />;
};

Main.Skeleton = function MainSkeleton() {
  return (
    <Skeleton>
      <div className={styles.productsList}>
        <ProductCard.Skeleton />
        <ProductCard.Skeleton />
        <ProductCard.Skeleton />
        <ProductCard.Skeleton />
        <ProductCard.Skeleton />
      </div>
    </Skeleton>
  );
};
