import React from "react";
import styles from "./product.module.css";
import { Text } from "../../components/ui/Text";
import { useParams } from "react-router-dom";
import { useGetDetailedProductQuery } from "../../store/slices/productsApiSlice";
import { parseAppInt } from "../../../helpers/parseAppInt";
import { Indent } from "../../components/ui/Indent";
import { isApiError } from "../../utils/isApiError";
import { AddToCardButton } from "../../components/AddToCardButton";
import { has } from "ramda";
import { BoneText } from "../../components/ui/Skeleton/BoneText";
import { Img } from "../../components/ui/Img";
import { Bone } from "../../components/ui/Skeleton/Bone";
import { Skeleton } from "../../components/ui/Skeleton";

export const Product = () => {
  const { id: paramsId } = useParams<"id">();
  const id = paramsId ? parseAppInt(paramsId) : null;

  const { data, isSuccess, isLoading, isError, error } =
    useGetDetailedProductQuery(id ?? 0, {
      skip: !id,
    });

  if (isError) {
    if (has("data", error) && isApiError(error.data)) {
      return <Text>{error.data.message}</Text>;
    }

    return <Text>Ошибка</Text>;
  }

  if (isLoading) return <Product.Skeleton />;

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
            <div style={{ aspectRatio: 1 }} key={image.url}>
              <Img
                src={"/static/productImages/" + image.url}
                alt={image.description}
              />
              <Indent size={3} />
            </div>
          ))}
      </div>

      <div className={styles.productContent}>
        <Text as="h2" textWeight="bold">
          {product.name}
        </Text>
        <Indent size={3} />

        <AddToCardButton
          stock={product.stock}
          price={product.price}
          productId={product.id}
        />
      </div>
    </div>
  );
};

Product.Skeleton = function ProductSkeleton() {
  return (
    <Skeleton>
      <div className={styles.productPage}>
        <div>
          <Bone aspectRatio="1" />
        </div>

        <div className={styles.productContent}>
          <BoneText size={2} />
          <Indent size={3} />
          <BoneText />
          <BoneText />
          <BoneText />
          <BoneText />
          <BoneText />
        </div>
      </div>
    </Skeleton>
  );
};
