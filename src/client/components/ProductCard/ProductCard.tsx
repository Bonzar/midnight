import React, { useMemo } from "react";
import styles from "./productCard.module.css";
import { Card } from "../ui/Card";
import { Link } from "react-router-dom";
import { Img } from "../ui/Img";
import { Indent } from "../ui/Indent";
import { Text } from "../ui/Text";
import { AddToCardButton } from "../AddToCardButton";
import { createSelector } from "@reduxjs/toolkit";
import { useGetProductsQuery } from "../../store/slices/productsApiSlice";
import type { GetAllProductsResponse } from "../../../server/controllers/productController";
import type { ScrollPosition } from "react-lazy-load-image-component";
import { Bone } from "../ui/Skeleton/Bone";
import { BoneText } from "../ui/Skeleton/BoneText";

interface IProductCardProps {
  id: number;
  scrollPosition: ScrollPosition;
}

export const ProductCard = ({ id, scrollPosition }: IProductCardProps) => {
  const selectProduct = useMemo(() => {
    return createSelector(
      (res: { data?: GetAllProductsResponse }) => res.data,
      (res: { data?: GetAllProductsResponse }, id: number) => id,
      (data, id) => data?.rows.find((product) => product.id === id)
    );
  }, []);

  const { product } = useGetProductsQuery(undefined, {
    selectFromResult: (result) => ({
      product: selectProduct(result, id),
    }),
  });

  if (!product) {
    return <ProductCard.Skeleton />;
  }

  return (
    <Card
      cardColor="venusSlipperOrchid"
      key={product.id}
      className={styles.productCardWrapper}
    >
      <div className={styles.productCardWrapper}>
        <Link to={`products/${product.id}`} className={styles.productCard}>
          <div style={{ aspectRatio: 1 }}>
            <Img
              src={"/static/productImages/" + product.productImages.at(0)?.url}
              alt={product.productImages.at(0)?.description}
              scrollPosition={scrollPosition}
            />
          </div>
          <Indent size={3} />
          <Text
            as="h2"
            textSize={4}
            textWeight="bold"
            className={styles.productName}
          >
            {product.name}
          </Text>
        </Link>
        <Indent size={3} />
        <AddToCardButton
          price={product.price}
          productId={product.id}
          stock={product.stock}
        />
      </div>
    </Card>
  );
};

ProductCard.Skeleton = function ProductCardSkeleton() {
  return (
    <div className={styles.productCardWrapper}>
      <div className={styles.productCard}>
        <Bone aspectRatio="1" />
        <Indent size={3} />
        <BoneText />
        <BoneText />
      </div>
    </div>
  );
};
