// Create a worker instance
const worker = new Worker(new URL("./worker.ts", import.meta.url), {
  type: "module",
});

// Helper to create unique IDs for messages
let messageId = 0;

// Helper function to send messages to worker and wait for response
function sendWorkerMessage(type: string, payload: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const id = messageId++;

    const handler = (e: MessageEvent) => {
      const { type: responseType, result, error, id: responseId } = e.data;

      if (responseId !== id) return;

      worker.removeEventListener("message", handler);

      if (responseType === "ERROR") {
        reject(new Error(error));
      } else {
        resolve(result);
      }
    };

    worker.addEventListener("message", handler);
    worker.postMessage({ type, payload, id });
  });
}

export async function analyzeImage(
  width: number,
  height: number,
  sizeInBytes: number,
  imageData: Uint8Array
) {
  return sendWorkerMessage("ANALYZE_IMAGE", {
    width,
    height,
    sizeInBytes,
    imageData,
  });
}

export async function findSaturation(pixels: Uint8Array): Promise<number> {
  return sendWorkerMessage("FIND_SATURATION", { pixels });
}

export async function findDominantColors(
  pixels: Uint8Array,
  k: number,
  maxIter: number
): Promise<Color[]> {
  return sendWorkerMessage("FIND_DOMINANT_COLORS", { pixels, k, maxIter });
}

export async function analyzeImageColors(
  pixels: Uint8Array
): Promise<ImageAnalysis> {
  return sendWorkerMessage("ANALYZE_IMAGE_COLORS", { pixels });
}
