export class QualityAnalysis {
  private readonly image: File;
  private readonly imageWidth: number;
  private readonly imageHeight: number;

  constructor(image: File, imageWidth: number, imageHeight: number) {
    this.image = image;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
  }

  public getImage(): File {
    return this.image;
  }

  /**
   * Calculates the ratio between file size and image dimensions (MB/MP).
   * A lower ratio typically indicates better compression.
   * Example: 2MB image / 4 megapixels = 0.5 ratio
   * - Ratios < 0.5: Excellent compression
   * - Ratios 0.5-1.5: Average compression
   * - Ratios > 1.5: Poor compression
   */
  public calculateFileSizeRatio(): number {
    const megapixels = (this.imageWidth * this.imageHeight) / 1000000;
    const fileSizeMB = this.image.size / (1024 * 1024);
    return Number((fileSizeMB / megapixels).toFixed(2));
  }

  /**
   * Estimates image loading time on a 3G connection (1.5 Mbps).
   * Formula: file size in bytes / (network speed in bits/8)
   * Example: 1MB file on 1.5Mbps connection:
   * 1,048,576 bytes / (1,572,864 bits/8) ≈ 5.33 seconds
   */
  public estimateLoadingTime(): number {
    const averageSpeed = (1.5 * 1024 * 1024) / 8;
    return Number((this.image.size / averageSpeed).toFixed(2));
  }

  /**
   * Calculates approximate RAM usage for the image in MB.
   * Uses 4 bytes per pixel (RGBA format):
   * - Red: 1 byte (0-255)
   * - Green: 1 byte (0-255)
   * - Blue: 1 byte (0-255)
   * - Alpha: 1 byte (0-255)
   * Formula: width * height * 4 bytes / (1024 * 1024) for MB
   */
  public calculateMemoryUsage(): number {
    const bytesPerPixel = 4;
    const totalMemoryBytes = this.imageWidth * this.imageHeight * bytesPerPixel;
    return Number((totalMemoryBytes / (1024 * 1024)).toFixed(2));
  }

  /**
   * Estimates rendering impact based on total pixel count:
   * - High: > 4MP (4 million pixels, equivalent to 2000x2000)
   * - Medium: 1-4MP (1-4 million pixels, equivalent to 1000x1000 to 2000x2000)
   * - Low: < 1MP (less than 1 million pixels, smaller than 1000x1000)
   */
  public estimateRenderingImpact(): string {
    const totalPixels = this.imageWidth * this.imageHeight;
    if (totalPixels > 4000000) return "High";
    if (totalPixels > 1000000) return "Medium";
    return "Low";
  }

  /**
   * Calculates required bandwidth (in Mbps) for a 1-second load time.
   * Formula: (file size in bytes * 8) / (1024 * 1024) for Mbps
   * Example: 1MB file needs 8Mbps bandwidth for 1-second load
   */
  public calculateBandwidth(): number {
    return Number(((this.image.size * 8) / (1024 * 1024)).toFixed(2));
  }

  /**
   * Converts file size to kilobytes (KB) for network transfer estimation.
   * Formula: file size in bytes / 1024
   */
  public calculateNetworkTransfer(): number {
    return Number((this.image.size / 1024).toFixed(2));
  }
}
