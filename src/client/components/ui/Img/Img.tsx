import React, { useEffect, useState } from "react";
import styles from "./img.module.css";
import type { LazyLoadImageProps } from "react-lazy-load-image-component";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  addCache,
  selectImageCacheById,
} from "../../../store/slices/imageCacheSlice";
import { useAppDispatch, useAppSelector } from "../../../store/helpers/hooks";
import type { ExtendableProps } from "../../types/PolymorphicComponent";
import { useFlashTime } from "../../../hooks/useFlashTime";
import { getClassName } from "../../../utils/react/getClassName";

interface IImgProps {
  src: string;
}

type ImgProps = ExtendableProps<LazyLoadImageProps, IImgProps>;

export const Img = ({ src, ...lazyLoadImageProps }: ImgProps) => {
  const dispatch = useAppDispatch();
  const isImageInCache = !!useAppSelector((state) =>
    selectImageCacheById(state, src)
  );

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingStart, setIsLoadingStart] = useState(false);
  const [isLoadedOnFlash, setIsLoadedOnFlash] = useState(false);

  const [isFlashTime, startFlashTime] = useFlashTime(30, true);

  useEffect(() => {
    if (isLoadingStart) {
      startFlashTime();
    }
  }, [startFlashTime, isLoadingStart]);

  useEffect(() => {
    if (isFlashTime && isLoaded) {
      setIsLoadedOnFlash(true);
    }
  }, [isFlashTime, isLoaded]);

  const showImage = !isFlashTime && isLoadedOnFlash;

  const showWrapper = !isLoadedOnFlash && !isFlashTime && isLoadingStart;

  const hideWrapper = !isLoadedOnFlash && !isFlashTime && isLoaded;

  return (
    <LazyLoadImage
      src={src}
      threshold={1000}
      visibleByDefault={isImageInCache}
      className={getClassName([
        styles.lazyImage,
        isImageInCache && styles.imageInCache,
        showImage && styles.lazyImageShow,
      ])}
      wrapperClassName={getClassName([
        styles.imageWrapper,
        isImageInCache && styles.imageWrapperImageInCache,
        showWrapper && styles.imageWrapperShowSkeleton,
        hideWrapper && styles.imageWrapperHideSkeleton,
      ])}
      beforeLoad={() => setIsLoadingStart(true)}
      afterLoad={() => {
        setIsLoaded(true);
        dispatch(addCache({ filename: src }));
      }}
      {...lazyLoadImageProps}
    />
  );
};
