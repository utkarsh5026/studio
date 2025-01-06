import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  setImage as setImageAction,
  removeImage as removeImageAction,
  setLoading as setLoadingAction,
} from "./slice";
import type { ImageInfo } from "./types";

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
        });
      };
      reader.readAsDataURL(file);
    },
    [setImage, startLoading]
  );

  return { image, setImage, removeImage, addFile, loading, error };
};
