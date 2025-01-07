import type {
  CompressionMetrics,
  FormatAnalysis,
  ArtifactAnalysis,
  QualityMetrics,
  LosslessAnalysis,
} from "./types";

class CompressionCalculator {
  private readonly imageData: ImageData;
  private readonly originalSize: number;
  private readonly width: number;
  private readonly height: number;
  private readonly colorDepth: number;

  constructor(
    imageData: ImageData,
    originalSize: number,
    colorDepth: number = 24 // Default to 24-bit color
  ) {
    this.imageData = imageData;
    this.originalSize = originalSize;
    this.width = imageData.width;
    this.height = imageData.height;
    this.colorDepth = colorDepth;
  }

  /**
   * Analyzes current compression state of the image
   * Takes into account file size, dimensions, and color depth
   */
  public analyzeCurrentCompression(): CompressionMetrics {
    // Calculate theoretical uncompressed size
    const uncompressedSize = this.width * this.height * (this.colorDepth / 8);

    // Calculate actual bits per pixel
    const bitsPerPixel = (this.originalSize * 8) / (this.width * this.height);

    // Calculate compression ratio
    const compressionRatio = this.originalSize / uncompressedSize;

    // Estimate current compression level (0-100)
    const currentLevel = Math.min(
      100,
      Math.round((1 - compressionRatio) * 100)
    );

    return {
      currentLevel,
      bitsPerPixel,
      compressionRatio,
    };
  }

  /**
   * Analyzes potential savings with different formats
   * Considers format-specific compression capabilities and image characteristics
   */
  public analyzeFormatPotential(): Array<FormatAnalysis> {
    // Define format characteristics
    const formats = [
      { name: "JPEG", compressionFactor: 0.25, qualityImpact: 0.15 },
      { name: "WebP", compressionFactor: 0.2, qualityImpact: 0.1 },
      { name: "AVIF", compressionFactor: 0.15, qualityImpact: 0.12 },
      { name: "JPEG 2000", compressionFactor: 0.22, qualityImpact: 0.08 },
      { name: "JPEG XR", compressionFactor: 0.23, qualityImpact: 0.09 },
    ];

    const imageComplexity = this.calculateImageComplexity();

    return formats.map((format) => {
      // Adjust compression factor based on image complexity
      const adjustedFactor =
        format.compressionFactor * (1 + imageComplexity * 0.2);

      const estimatedSize = this.originalSize * adjustedFactor;
      const savings =
        ((this.originalSize - estimatedSize) / this.originalSize) * 100;

      return {
        format: format.name,
        potentialSavings: Math.round(savings),
        estimatedFileSize: Math.round(estimatedSize),
        qualityTradeoff: Math.round(format.qualityImpact * 100),
      };
    });
  }

  /**
   * Detects and analyzes compression artifacts
   * Focuses on JPEG block artifacts and color banding
   */
  public analyzeArtifacts(): ArtifactAnalysis {
    const blockSize = 8; // JPEG standard block size
    const artifacts: Array<{ x: number; y: number }> = [];
    const data = this.imageData.data;
    let totalBlockiness = 0;

    // Analyze block boundaries for artifacts
    for (let y = 0; y < this.height - blockSize; y += blockSize) {
      for (let x = 0; x < this.width - blockSize; x += blockSize) {
        const blockScore = this.calculateBlockArtifactScore(x, y, data);
        if (blockScore > 20) {
          artifacts.push({ x, y });
          totalBlockiness += blockScore;
        }
      }
    }

    const totalBlocks = (this.width * this.height) / (blockSize * blockSize);
    const severity = Math.min(100, (artifacts.length / totalBlocks) * 100);

    return {
      severity,
      blockiness: totalBlockiness / totalBlocks,
      locations: artifacts,
      affectedArea:
        (artifacts.length * blockSize * blockSize) / (this.width * this.height),
    };
  }

  /**
   * Predicts quality impact of further compression
   * Uses multiple metrics for comprehensive analysis
   */
  public predictQualityImpact(targetCompressionLevel: number): QualityMetrics {
    const currentCompression = this.analyzeCurrentCompression().currentLevel;
    const compressionDiff = targetCompressionLevel - currentCompression;

    // Calculate PSNR (Peak Signal-to-Noise Ratio)
    const psnr = this.calculatePSNR(compressionDiff);

    // Estimate SSIM (Structural Similarity Index)
    const ssim = this.calculateSSIM(compressionDiff);

    // Determine visual impact
    let visualImpact = "Minimal";
    let qualityScore = 100;

    if (compressionDiff > 30) {
      visualImpact = "Severe";
      qualityScore = Math.max(0, 100 - compressionDiff);
    } else if (compressionDiff > 20) {
      visualImpact = "Moderate";
      qualityScore = Math.max(40, 100 - compressionDiff * 1.5);
    } else if (compressionDiff > 10) {
      visualImpact = "Noticeable";
      qualityScore = Math.max(70, 100 - compressionDiff * 1.2);
    }

    return {
      psnr,
      ssim,
      visualImpact,
      qualityScore,
    };
  }

  /**
   * Analyzes potential for lossless compression
   * Uses entropy analysis and pattern detection
   */
  public analyzeLosslessPotential(): LosslessAnalysis {
    const entropy = this.calculateImageEntropy();
    const currentBpp = (this.originalSize * 8) / (this.width * this.height);
    const theoreticalMinBpp = entropy / 3; // Divide by 3 for RGB channels

    const potential = Math.max(
      0,
      Math.min(100, ((currentBpp - theoreticalMinBpp) / currentBpp) * 100)
    );

    let recommendation = "Current compression is optimal";
    let estimatedSavings = 0;

    if (potential > 20) {
      recommendation = "Significant lossless compression possible";
      estimatedSavings = this.originalSize * (potential / 100);
    } else if (potential > 10) {
      recommendation = "Moderate lossless compression possible";
      estimatedSavings = this.originalSize * (potential / 150);
    } else if (potential > 5) {
      recommendation = "Minor lossless compression possible";
      estimatedSavings = this.originalSize * (potential / 200);
    }

    return {
      potential,
      entropy,
      recommendation,
      estimatedSavings: Math.round(estimatedSavings),
    };
  }

  // Private helper methods

  /**
   * Calculates image complexity based on color variance and edge detection
   */
  private calculateImageComplexity(): number {
    const data = this.imageData.data;
    let totalVariance = 0;
    let edgeCount = 0;

    // Calculate color variance and edge detection
    for (let i = 0; i < data.length; i += 4) {
      if (i > 0) {
        const colorDiff =
          Math.abs(data[i] - data[i - 4]) +
          Math.abs(data[i + 1] - data[i - 3]) +
          Math.abs(data[i + 2] - data[i - 2]);
        totalVariance += colorDiff;
        if (colorDiff > 30) edgeCount++;
      }
    }

    const averageVariance = totalVariance / (data.length / 4);
    const edgeDensity = edgeCount / (data.length / 4);

    return (averageVariance / 255 + edgeDensity) / 2;
  }

  /**
   * Calculates block artifact score for a specific region
   */
  private calculateBlockArtifactScore(
    x: number,
    y: number,
    data: Uint8ClampedArray
  ): number {
    const idx = (y * this.width + x) * 4;
    let score = 0;

    // Check horizontal edges
    for (let i = 0; i < 8; i++) {
      const diff = Math.abs(data[idx + i * 4] - data[idx + (i + 1) * 4]);
      score += diff;
    }

    // Check vertical edges
    for (let i = 0; i < 8; i++) {
      const diff = Math.abs(
        data[idx + i * this.width * 4] - data[idx + (i + 1) * this.width * 4]
      );
      score += diff;
    }

    return score / 16; // Average difference
  }

  /**
   * Calculates Peak Signal-to-Noise Ratio
   */
  private calculatePSNR(compressionDiff: number): number {
    // Simplified PSNR calculation
    return Math.max(20, 50 - compressionDiff * 0.3);
  }

  /**
   * Estimates Structural Similarity Index
   */
  private calculateSSIM(compressionDiff: number): number {
    // Simplified SSIM estimation
    return Math.max(0.5, 1 - compressionDiff * 0.005);
  }

  /**
   * Calculates image entropy for compression potential analysis
   */
  private calculateImageEntropy(): number {
    const histogram = new Array(256).fill(0);
    const data = this.imageData.data;

    // Calculate histogram
    for (let i = 0; i < data.length; i += 4) {
      histogram[data[i]]++; // Red channel
      histogram[data[i + 1]]++; // Green channel
      histogram[data[i + 2]]++; // Blue channel
    }

    // Calculate entropy
    const totalPixels = this.width * this.height * 3;
    let entropy = 0;

    histogram.forEach((count) => {
      if (count > 0) {
        const probability = count / totalPixels;
        entropy -= probability * Math.log2(probability);
      }
    });

    return entropy;
  }
}

export default CompressionCalculator;
