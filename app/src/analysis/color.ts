import type { Color } from "./types";

/**
 * Finds the 5 most dominant colors in an image
 * @param pixels - The pixel data from the image as a Uint8ClampedArray (RGBA format)
 * @returns An array of the 5 most frequently occurring colors, each as an RGB object
 * @example
 * // Returns array of 5 most common colors like:
 * // [{r: 255, g: 255, b: 255}, {r: 0, g: 0, b: 0}, ...]
 * findDominantColors(imageData.data)
 */
export function findDominantColors(pixels: Uint8ClampedArray): Color[] {
  const colorMap = new Map<string, number>();

  for (let i = 0; i < pixels.length; i += 4) {
    const key = `${pixels[i]},${pixels[i + 1]},${pixels[i + 2]}`;
    colorMap.set(key, (colorMap.get(key) ?? 0) + 1);
  }

  return Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key]) => {
      const [r, g, b] = key.split(",").map(Number);
      return { r, g, b };
    });
}

/**
 * Calculates the average saturation of an image
 * @param pixels - The pixel data from the image as a Uint8ClampedArray (RGBA format)
 * @returns A number between 0 and 1 representing the average saturation,
 * where 0 is completely unsaturated (grayscale) and 1 is fully saturated
 * @example
 * // Returns a value like 0.65 for an image with moderate saturation
 * calculateSaturation(imageData.data)
 */
export function calculateSaturation(pixels: Uint8ClampedArray): number {
  let totalSaturation = 0;
  const pixelCount = pixels.length / 4;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i] / 255;
    const g = pixels[i + 1] / 255;
    const b = pixels[i + 2] / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;

    totalSaturation += saturation;
  }

  return totalSaturation / pixelCount;
}
