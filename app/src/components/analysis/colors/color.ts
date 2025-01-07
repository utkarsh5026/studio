import type { Color } from "./types";

const worker = new Worker(new URL("./color.worker.ts", import.meta.url), {
  type: "module",
});

export function findDominantColors(
  pixels: Uint8ClampedArray
): Promise<Color[]> {
  return new Promise((resolve, reject) => {
    worker.onmessage = (e) => resolve(e.data);
    worker.onerror = (e) => reject(e);
    worker.postMessage({ type: "dominantColors", pixels }, []);
  });
}

export function calculateSaturation(
  pixels: Uint8ClampedArray
): Promise<number> {
  return new Promise((resolve, reject) => {
    worker.onmessage = (e) => resolve(e.data);
    worker.onerror = (e) => reject(e);
    worker.postMessage({ type: "saturation", pixels }, []);
  });
}
