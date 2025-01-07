import { useState, useEffect } from "react";

export type CanvasResult = {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
  imageData: ImageData | null;
  error: string | null;
};

type UseCanvasProps = {
  file: File | null;
  onSuccess: (result: CanvasResult) => void;
  onError: (error: string) => void;
};

/**
 * A custom React hook that handles canvas operations for image processing.
 *
 * This hook creates a canvas element, loads an image from a file, and provides
 * access to the canvas context and image data. It handles various error cases
 * and cleanup operations automatically.
 *
 * @param {UseCanvasProps} props - The props object containing file and callback functions
 * @param {File | null} props.file - The image file to be processed
 * @param {function} props.onSuccess - Callback function called when image is successfully processed
 * @param {function} props.onError - Callback function called when an error occurs
 *
 * @returns {CanvasResult} An object containing the canvas element, context, image data, and any errors
 *
 * @example
 * ```tsx
 * const { canvas, context, imageData, error } = useCanvas({
 *   file: imageFile,
 *   onSuccess: (result) => console.log('Image processed:', result),
 *   onError: (error) => console.error('Error:', error)
 * });
 * ```
 */
export const useCanvas = ({ file, onSuccess, onError }: UseCanvasProps) => {
  const [result, setResult] = useState<CanvasResult>({
    canvas: null,
    context: null,
    imageData: null,
    error: null,
  });

  useEffect(() => {
    if (!file) return;

    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setResult((prev) => ({
        ...prev,
        error: "Could not get canvas context",
      }));
      return;
    }

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setResult({
          canvas,
          context: ctx,
          imageData,
          error: null,
        });
        onSuccess({
          canvas,
          context: ctx,
          imageData,
          error: null,
        });
      } catch (err) {
        setResult((prev) => ({
          ...prev,
          error: "Failed to process image" + err,
        }));
        onError("Failed to process image" + err);
      }
    };

    img.onerror = () => {
      setResult((prev) => ({ ...prev, error: "Failed to load image" }));
      onError("Failed to load image");
    };

    img.src = URL.createObjectURL(file);

    return () => {
      URL.revokeObjectURL(img.src);
    };
  }, [file, onSuccess, onError]);

  return result;
};
