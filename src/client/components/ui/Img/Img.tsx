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

interface IImgProps {
  src: string;
}

type ImgProps = ExtendableProps<LazyLoadImageProps, IImgProps>;

export const Img = ({ src, ...lazyLoadImageProps }: ImgProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingStart, setIsLoadingStart] = useState(false);
  const [isLoadedOnFlash, setIsLoadedOnFlash] = useState(false);

  const [isFlashTime, setIsFlashTime] = useState(true);

  useEffect(() => {
    if (!isLoadingStart) return;

    const timeoutId = setTimeout(() => {
      setIsFlashTime(false);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [isLoadingStart]);

  useEffect(() => {
    if (isFlashTime && isLoaded) {
      setIsLoadedOnFlash(true);
    }
  }, [isFlashTime, isLoaded]);

  const dispatch = useAppDispatch();
  const isImageInCache = useAppSelector((state) => {
    if (!src) return null;

    return selectImageCacheById(state, src);
  });

  const hideImage = !isFlashTime && !isLoadedOnFlash;

  const showWrapper = !isLoadedOnFlash && !isFlashTime && isLoadingStart;

  const hideWrapper = !isLoadedOnFlash && !isFlashTime && isLoaded;

  return (
    <LazyLoadImage
      visibleByDefault={!!isImageInCache}
      className={[styles.lazyImage, hideImage && styles.lazyImageLoaded]
        .filter(Boolean)
        .join(" ")}
      wrapperClassName={[
        showWrapper && styles.lazyImageWrapper,
        hideWrapper && styles.imageLoaded,
      ]
        .filter(Boolean)
        .join(" ")}
      beforeLoad={() => setIsLoadingStart(true)}
      afterLoad={() => {
        setIsLoaded(true);
        dispatch(addCache({ filename: src }));
      }}
      src={src}
      {...lazyLoadImageProps}
    />
  );
};
