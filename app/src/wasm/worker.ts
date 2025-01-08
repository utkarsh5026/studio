import init, {
  calculate_aspect_ratio,
  format_file_size,
  calculate_average_luminance,
  calc_saturation,
  Color,
  find_dominant_colors,
  analyze_image_colors,
  ImageAnalysis,
} from "../../../rust/pkg/rust";

// Initialize WASM module when worker starts
init().then(() => {
  postMessage({ type: "READY" });
});

async function analyzeImage(
  width: number,
  height: number,
  sizeInBytes: number,
  imageData: Uint8Array
) {
  const aspectRatio = calculate_aspect_ratio(width, height);
  const fileSize = format_file_size(sizeInBytes);
  const luminance = calculate_average_luminance(imageData, width, height);

  return {
    aspectRatio: {
      width: aspectRatio.height,
      height: aspectRatio.width,
    },
    fileSize,
    luminance,
  };
}

async function findSaturation(pixels: Uint8Array): Promise<number> {
  return calc_saturation(pixels);
}

async function findDominantColors(
  pixels: Uint8Array,
  k: number,
  maxIter: number
): Promise<Color[]> {
  return find_dominant_colors(pixels, k, maxIter);
}

async function analyzeImageColors(pixels: Uint8Array): Promise<ImageAnalysis> {
  return analyze_image_colors(pixels);
}

// Handle incoming messages
self.onmessage = async (e) => {
  const { type, payload, id } = e.data;

  try {
    let result;
    switch (type) {
      case "ANALYZE_IMAGE":
        result = await analyzeImage(
          payload.width,
          payload.height,
          payload.sizeInBytes,
          payload.imageData
        );
        break;
      case "FIND_SATURATION":
        result = await findSaturation(payload.pixels);
        break;
      case "FIND_DOMINANT_COLORS":
        result = await findDominantColors(
          payload.pixels,
          payload.k,
          payload.maxIter
        );
        break;
      case "ANALYZE_IMAGE_COLORS":
        result = await analyzeImageColors(payload.pixels);
        break;
    }
    postMessage({ type: "SUCCESS", result, id });
  } catch (error) {
    postMessage({ type: "ERROR", error: (error as Error).message, id });
  }
};
