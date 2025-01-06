import type { ImageDimensions } from "./types";

/**
 * Calculates the simplified aspect ratio for given dimensions
 * @param width - The width of the image in pixels
 * @param height - The height of the image in pixels
 * @returns An object containing the simplified width and height values representing the aspect ratio
 * @example
 * // Returns {width: 16, height: 9} for a 1920x1080 image
 * calculateAspectRatio(1920, 1080)
 */
export function calculateAspectRatio(
  width: number,
  height: number
): ImageDimensions {
  const gcd = (a: number, b: number): number => {
    return b ? gcd(b, a % b) : a;
  };
  const divisor = gcd(width, height);

  return {
    width: width / divisor,
    height: height / divisor,
  };
}

/**
 * Formats the file size in bytes to a human-readable format
 * @param size_in_bytes - The file size in bytes
 * @returns A string representing the file size in a human-readable format
 * @example
 * // Returns "1.23 MB" for a file size of 1234567 bytes
 * formatFileSize(1234567)
 */
export function formatFileSize(size_in_bytes: number): string {
  const units = ["B", "KB", "MB"];
  let unitIndex = 0;

  let size = size_in_bytes;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Calculates the average luminance of an image
 * @param ctx - The canvas rendering context
 * @param height - The height of the image in pixels
 * @param width - The width of the image in pixels
 * @returns The average luminance of the image
 */
export function calculateAverageLuminance(
  ctx: CanvasRenderingContext2D,
  height: number,
  width: number
): number {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  let sum = 0;

  // Process each pixel (RGBA values)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Calculate relative luminance without dividing by 255 here
    sum += 0.299 * r + 0.587 * g + 0.114 * b;
  }

  // Divide by total number of pixels and normalize to 0-1 range
  return sum / (width * height) / 255;
}
