import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  setImage as setImageAction,
  removeImage as removeImageAction,
  setLoading as setLoadingAction,
  addDimensions as addDimensionsAction,
} from "./slice";
import type { ImageInfo, dimensions } from "./types";
import { useCanvas, type CanvasResult } from "../../canvas/useCanvas";

export const useImage = () => {
  const dispatch = useAppDispatch();
  const { image, loading, error } = useAppSelector((state) => state.image);

  const setImage = useCallback(
    (image: ImageInfo) => dispatch(setImageAction(image)),
    [dispatch]
  );

  const removeImage = useCallback(
    () => dispatch(removeImageAction()),
    [dispatch]
  );

  const startLoading = useCallback(
    () => dispatch(setLoadingAction(true)),
    [dispatch]
  );

  const addFile = useCallback(
    (file: File) => {
      startLoading();
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          image: file,
          preview: reader.result as string,
          dimensions: null,
        });
      };
      reader.readAsDataURL(file);
    },
    [setImage, startLoading]
  );

  const addDimensions = useCallback(
    (dimensions: dimensions) => dispatch(addDimensionsAction(dimensions)),
    [dispatch]
  );

  const handleCanvasSuccess = useCallback(
    (result: CanvasResult) => {
      if (result.imageData) {
        addDimensions({
          width: result.imageData.width,
          height: result.imageData.height,
        });
      }
    },
    [addDimensions]
  );

  const handleCanvasError = useCallback((error: string) => {
    console.error(error);
  }, []);

  const canvasResult = useCanvas({
    file: image?.image || null,
    onSuccess: handleCanvasSuccess,
    onError: handleCanvasError,
  });

  return {
    image,
    setImage,
    removeImage,
    addFile,
    addDimensions,
    loading,
    error,
    canvasResult,
  };
};
