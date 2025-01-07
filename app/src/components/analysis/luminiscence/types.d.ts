/**
 * Represents the distribution of brightness levels across an image
 */
export type BrightnessDistribution = {
  /** Average brightness value across all pixels (0-255) */
  meanBrightness: number;
  /** Distribution of pixels across different brightness ranges */
  distribution: Array<{
    /** Label for the brightness range (e.g. "Very Dark", "Dark", etc) */
    range: string;
    /** Percentage of pixels falling within this range */
    percentage: number;
  }>;
  /** Overall assessment of the brightness distribution */
  assessment: string;
};

/**
 * Represents a single point in the luminance histogram
 */
export type HistogramData = {
  /** Luminance value (0-255) */
  value: number;
  /** Percentage of pixels with this luminance value */
  count: number;
};

/**
 * Analysis of dark and light regions in the image
 */
export type RegionAnalysis = {
  /** Analysis of dark regions */
  darkRegions: {
    /** Percentage of image covered by dark regions */
    percentage: number;
    /** Description of the impact of dark regions */
    significance: string;
  };
  /** Analysis of light regions */
  lightRegions: {
    /** Percentage of image covered by light regions */
    percentage: number;
    /** Description of the impact of light regions */
    significance: string;
  };
  /** Overall assessment of region balance */
  assessment: string;
};

/**
 * Analysis of the image's dynamic range characteristics
 */
export type DynamicRangeAnalysis = {
  /** Absolute range between darkest and brightest pixels */
  range: number;
  /** Range between 1st and 99th percentile luminance values */
  effectiveRange: number;
  /** Assessment of the dynamic range quality */
  assessment: string;
  /** Distribution across tonal zones */
  zones: Array<{
    /** Name of the tonal zone (e.g. "Shadows", "Mid-tones", etc) */
    zone: string;
    /** Percentage of pixels present in this zone */
    presence: number;
  }>;
};

/**
 * Analysis of the image's gamma curve characteristics
 */
export type GammaCurveAnalysis = {
  /** Calculated gamma value of the image */
  estimatedGamma: number;
  /** Target gamma value for web display (typically 2.2) */
  idealGamma: number;
  /** Required gamma correction factor */
  correction: number;
  /** Assessment of gamma curve quality */
  assessment: string;
};

/**
 * Analysis of shadow and highlight clipping
 */
export type ClippingAnalysis = {
  /** Percentage of pixels with complete shadow clipping */
  shadowClipping: number;
  /** Percentage of pixels with complete highlight clipping */
  highlightClipping: number;
  /** Overall assessment of clipping issues */
  assessment: string;
  /** Suggested actions to address clipping problems */
  recommendations: string[];
};

/**
 * Complete luminance analysis results combining all metrics
 */
export type LuminanceAnalysis = {
  /** Analysis of overall brightness distribution */
  brightnessDistribution: BrightnessDistribution;
  /** Raw histogram data of luminance values */
  histogram: HistogramData[];
  /** Analysis of dark and light regions */
  regions: RegionAnalysis;
  /** Analysis of dynamic range characteristics */
  dynamicRangeAnalysis: DynamicRangeAnalysis;
  /** Analysis of gamma curve characteristics */
  gammaCurveAnalysis: GammaCurveAnalysis;
  /** Analysis of shadow and highlight clipping */
  clippingAnalysis: ClippingAnalysis;
};
