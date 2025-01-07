/**
 * Metrics describing the current compression state of an image
 */
export type CompressionMetrics = {
  /** Current compression level (0-100) */
  currentLevel: number;
  /** Average number of bits used to store each pixel */
  bitsPerPixel: number;
  /** Ratio between original and compressed file sizes */
  compressionRatio: number;
};

/**
 * Analysis of potential compression using different image formats
 */
export type FormatAnalysis = {
  /** Image format name (e.g., 'JPEG', 'WebP', 'AVIF') */
  format: string;
  /** Potential file size reduction in bytes */
  potentialSavings: number;
  /** Expected file size after compression in bytes */
  estimatedFileSize: number;
  /** Impact on image quality (0-100) */
  qualityTradeoff: number;
};

/**
 * Analysis of compression artifacts in the image
 */
export type ArtifactAnalysis = {
  /** Overall severity of artifacts (0-100) */
  severity: number;
  /** Measure of visible compression blocks (0-100) */
  blockiness: number;
  /** Coordinates of detected artifacts */
  locations: Array<{ x: number; y: number }>;
  /** Percentage of image affected by artifacts */
  affectedArea: number;
};

/**
 * Metrics measuring the quality impact of compression
 */
export type QualityMetrics = {
  /** Peak Signal-to-Noise Ratio in decibels */
  psnr: number;
  /** Structural Similarity Index (0-1) */
  ssim: number;
  /** Human-readable description of quality impact */
  visualImpact: string;
  /** Overall quality score (0-100) */
  qualityScore: number;
};

/**
 * Analysis of lossless compression possibilities
 */
export type LosslessAnalysis = {
  /** Likelihood of effective lossless compression (0-100) */
  potential: number;
  /** Image entropy score */
  entropy: number;
  /** Suggested compression approach */
  recommendation: string;
  /** Expected bytes saved through lossless compression */
  estimatedSavings: number;
};

/**
 * Comprehensive analysis of image compression options
 */
export type CompressionAnalysis = {
  /** Current compression state */
  currentCompression: CompressionMetrics;
  /** Analysis of different format options */
  formatPotential: FormatAnalysis[];
  /** Analysis of compression artifacts */
  artifacts: ArtifactAnalysis;
  /** Impact on image quality */
  qualityImpact: QualityMetrics;
  /** Lossless compression analysis */
  losslessPotential: LosslessAnalysis;
};
