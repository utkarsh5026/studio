import init, {
  calculate_aspect_ratio,
  format_file_size,
  calculate_average_luminance,
} from "../../../rust/pkg/rust";

// Initialize WASM module
await init();

export async function analyzeImage(
  width: number,
  height: number,
  sizeInBytes: number,
  imageData: Uint8Array
): Promise<{
  aspectRatio: { width: number; height: number };
  fileSize: string;
  luminance: number;
}> {
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
