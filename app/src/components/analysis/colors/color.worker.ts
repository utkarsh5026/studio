import type { Color } from "./types";

function euclideanDistance(point1: number[], point2: number[]): number {
  return Math.sqrt(
    point1.reduce((sum, val, i) => sum + Math.pow(val - point2[i], 2), 0)
  );
}

function arraysEqual(arr1: number[][], arr2: number[][]): boolean {
  return arr1.every((arr, i) => arr.every((val, j) => val === arr2[i][j]));
}

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
  // Convert pixels to array of points
  const points: number[][] = [];
  for (let i = 0; i < pixels.length; i += 4) {
    points.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
  }

  // K-means clustering
  const k = 5; // number of clusters
  const maxIterations = 20;

  let centroids = Array.from({ length: k }, () => {
    const randomIndex = Math.floor(Math.random() * points.length);
    return [...points[randomIndex]];
  });

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const clusters: number[][][] = Array.from({ length: k }, () => []);

    for (const point of points) {
      let minDistance = Infinity;
      let closestCentroidIndex = 0;

      centroids.forEach((centroid, index) => {
        const distance = euclideanDistance(point, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroidIndex = index;
        }
      });

      clusters[closestCentroidIndex].push(point);
    }

    const newCentroids = clusters.map((cluster) => {
      if (cluster.length === 0) return centroids[0]; // Avoid empty clusters
      return cluster
        .reduce(
          (acc, point) => {
            return acc.map((val, i) => val + point[i]);
          },
          [0, 0, 0]
        )
        .map((val) => Math.round(val / cluster.length));
    });

    if (arraysEqual(centroids, newCentroids)) break;
    centroids = newCentroids;
  }

  return centroids.map(([r, g, b]) => ({ r, g, b }));
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

self.onmessage = (e: MessageEvent) => {
  try {
    const { type, pixels } = e.data;
    let result;

    if (type === "dominantColors") {
      result = findDominantColors(pixels);
    } else if (type === "saturation") {
      result = calculateSaturation(pixels);
    } else {
      throw new Error(`Unknown operation type: ${type}`);
    }

    self.postMessage(result);
  } catch (error) {
    self.postMessage({
      error: error instanceof Error ? error : new Error(String(error)),
    });
  }
};
