import type {
  BrightnessDistribution,
  HistogramData,
  RegionAnalysis,
  DynamicRangeAnalysis,
  GammaCurveAnalysis,
  ClippingAnalysis,
  LuminanceAnalysis,
} from "./types";

class LuminanceAnalyzer {
  private readonly imageData: ImageData;
  private readonly luminanceValues: number[];

  constructor(imageData: ImageData) {
    this.imageData = imageData;
    this.luminanceValues = this.calculateLuminanceValues();
  }

  /**
   * Converts RGB to luminance using the standard formula:
   * Y = 0.2126R + 0.7152G + 0.0722B
   */
  private rgbToLuminance(r: number, g: number, b: number): number {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Calculates luminance values for each pixel
   */
  private calculateLuminanceValues(): number[] {
    const values = [];
    const data = this.imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const luminance = this.rgbToLuminance(data[i], data[i + 1], data[i + 2]);
      values.push(luminance);
    }

    return values;
  }

  /**
   * Analyzes brightness distribution across the image
   */
  public analyzeBrightnessDistribution(): BrightnessDistribution {
    const total = this.luminanceValues.reduce((sum, val) => sum + val, 0);
    const meanBrightness = total / this.luminanceValues.length;

    // Create brightness ranges
    const ranges = [
      { min: 0, max: 51, label: "Very Dark" },
      { min: 51, max: 102, label: "Dark" },
      { min: 102, max: 153, label: "Medium" },
      { min: 153, max: 204, label: "Bright" },
      { min: 204, max: 255, label: "Very Bright" },
    ];

    const distribution = ranges.map((range) => {
      const count = this.luminanceValues.filter(
        (val) => val >= range.min && val < range.max
      ).length;

      return {
        range: range.label,
        percentage: Number(
          ((count / this.luminanceValues.length) * 100).toFixed(1)
        ),
      };
    });

    let assessment = "";
    if (meanBrightness < 85) {
      assessment =
        "The image tends to be dark, which might affect visibility in low-light conditions.";
    } else if (meanBrightness > 170) {
      assessment =
        "The image is generally bright, which might cause eye strain in dark environments.";
    } else {
      assessment = "The image has a balanced brightness distribution.";
    }

    return {
      meanBrightness: Number(meanBrightness.toFixed(1)),
      distribution,
      assessment,
    };
  }

  /**
   * Generates a luminance histogram with 256 levels
   */
  public generateHistogram(): HistogramData[] {
    const histogram = new Array(256).fill(0);

    this.luminanceValues.forEach((val) => {
      histogram[Math.round(val)]++;
    });

    return histogram.map((count, value) => ({
      value,
      count: (count / this.luminanceValues.length) * 100,
    }));
  }

  /**
   * Detects and analyzes dark and light regions
   */
  public analyzeRegions(): RegionAnalysis {
    const darkThreshold = 64;
    const lightThreshold = 192;

    const darkCount = this.luminanceValues.filter(
      (val) => val < darkThreshold
    ).length;
    const lightCount = this.luminanceValues.filter(
      (val) => val > lightThreshold
    ).length;

    const darkPercentage = (darkCount / this.luminanceValues.length) * 100;
    const lightPercentage = (lightCount / this.luminanceValues.length) * 100;

    const getDarkSignificance = (percentage: number) => {
      if (percentage > 40) return "Dominant dark regions may obscure details";
      if (percentage > 20) return "Balanced dark areas provide good contrast";
      return "Limited dark areas maintain good visibility";
    };

    const getLightSignificance = (percentage: number) => {
      if (percentage > 40) return "Large bright areas might cause glare";
      if (percentage > 20) return "Well-balanced highlight areas";
      return "Conservative use of bright regions";
    };

    return {
      darkRegions: {
        percentage: Number(darkPercentage.toFixed(1)),
        significance: getDarkSignificance(darkPercentage),
      },
      lightRegions: {
        percentage: Number(lightPercentage.toFixed(1)),
        significance: getLightSignificance(lightPercentage),
      },
      assessment: this.getRegionAssessment(darkPercentage, lightPercentage),
    };
  }

  private getRegionAssessment(darkPct: number, lightPct: number): string {
    if (darkPct > 40 && lightPct > 40) {
      return "High contrast image with potential loss of mid-tone details";
    }
    if (darkPct < 10 && lightPct < 10) {
      return "Low contrast image that might appear flat";
    }
    return "Well-balanced distribution of dark and light regions";
  }

  /**
   * Calculates the dynamic range of the image
   */
  public calculateDynamicRange(): DynamicRangeAnalysis {
    // Find min/max without sorting the entire array
    let min = this.luminanceValues[0];
    let max = this.luminanceValues[0];

    // Calculate min, max, and zone counts in a single pass
    const zoneSize = 51;
    const zones = Array(5).fill(0);

    for (const val of this.luminanceValues) {
      min = Math.min(min, val);
      max = Math.max(max, val);
      const zoneIndex = Math.min(4, Math.floor(val / zoneSize));
      zones[zoneIndex]++;
    }

    // Calculate percentiles without full sort
    const histogram = new Array(256).fill(0);
    this.luminanceValues.forEach((val) => histogram[Math.round(val)]++);

    let count = 0;
    let percentile1 = 0;
    const target1 = this.luminanceValues.length * 0.01;

    // Find 1st percentile
    for (let i = 0; i < histogram.length; i++) {
      count += histogram[i];
      if (count >= target1) {
        percentile1 = i;
        break;
      }
    }

    // Find 99th percentile
    count = 0;
    let percentile99 = 255;
    const target99 = this.luminanceValues.length * 0.99;

    for (let i = histogram.length - 1; i >= 0; i--) {
      count += histogram[i];
      if (count >= this.luminanceValues.length - target99) {
        percentile99 = i;
        break;
      }
    }

    const absoluteRange = max - min;
    const effectiveRange = percentile99 - percentile1;

    const zoneNames = [
      "Shadows",
      "Dark Mid-tones",
      "Mid-tones",
      "Light Mid-tones",
      "Highlights",
    ];

    return {
      range: Number(absoluteRange.toFixed(1)),
      effectiveRange: Number(effectiveRange.toFixed(1)),
      assessment: this.getDynamicRangeAssessment(effectiveRange),
      zones: zones.map((count, index) => ({
        zone: zoneNames[index],
        presence: Number(
          ((count / this.luminanceValues.length) * 100).toFixed(1)
        ),
      })),
    };
  }

  private getDynamicRangeAssessment(effectiveRange: number): string {
    if (effectiveRange > 200) {
      return "Very high dynamic range - ensure display capability matches";
    }
    if (effectiveRange > 150) {
      return "Good dynamic range for most displays";
    }
    if (effectiveRange > 100) {
      return "Moderate dynamic range - suitable for web display";
    }
    return "Limited dynamic range - consider contrast enhancement";
  }

  /**
   * Analyzes the gamma curve of the image
   */
  public analyzeGammaCurve(): GammaCurveAnalysis {
    // Calculate average gamma using middle gray method
    const midGrayPixels = this.luminanceValues.filter(
      (val) => val > 117 && val < 137
    );
    const averageMiddleGray =
      midGrayPixels.reduce((sum, val) => sum + val, 0) / midGrayPixels.length;

    const estimatedGamma = Math.log(averageMiddleGray / 255) / Math.log(0.5);
    const idealGamma = 2.2; // Standard gamma for web
    const correction = idealGamma / estimatedGamma;

    return {
      estimatedGamma: Number(estimatedGamma.toFixed(2)),
      idealGamma,
      correction: Number(correction.toFixed(2)),
      assessment: this.getGammaAssessment(estimatedGamma),
    };
  }

  private getGammaAssessment(gamma: number): string {
    if (gamma < 1.8) {
      return "Image appears dark - gamma correction might improve visibility";
    }
    if (gamma > 2.6) {
      return "Image appears bright - consider reducing gamma";
    }
    return "Gamma is well-balanced for standard displays";
  }

  /**
   * Detects clipping in highlights and shadows
   */
  public detectClipping(): ClippingAnalysis {
    const shadowThreshold = 5;
    const highlightThreshold = 250;

    const shadowClipping = this.luminanceValues.filter(
      (val) => val < shadowThreshold
    ).length;
    const highlightClipping = this.luminanceValues.filter(
      (val) => val > highlightThreshold
    ).length;

    const shadowPercentage =
      (shadowClipping / this.luminanceValues.length) * 100;
    const highlightPercentage =
      (highlightClipping / this.luminanceValues.length) * 100;

    const recommendations = [];
    if (shadowPercentage > 5) {
      recommendations.push("Consider lifting shadows to recover detail");
    }
    if (highlightPercentage > 5) {
      recommendations.push("Reduce exposure to recover highlight detail");
    }
    if (shadowPercentage > 2 && highlightPercentage > 2) {
      recommendations.push("Consider using HDR techniques to preserve detail");
    }

    return {
      shadowClipping: Number(shadowPercentage.toFixed(1)),
      highlightClipping: Number(highlightPercentage.toFixed(1)),
      assessment: this.getClippingAssessment(
        shadowPercentage,
        highlightPercentage
      ),
      recommendations,
    };
  }

  private getClippingAssessment(
    shadowPct: number,
    highlightPct: number
  ): string {
    if (shadowPct > 5 && highlightPct > 5) {
      return "Significant detail loss in both shadows and highlights";
    }
    if (shadowPct > 5) {
      return "Notable shadow detail loss";
    }
    if (highlightPct > 5) {
      return "Significant highlight clipping";
    }
    return "Good detail preservation across tonal range";
  }

  public getAnalysis(): LuminanceAnalysis {
    return {
      brightnessDistribution: this.analyzeBrightnessDistribution(),
      histogram: this.generateHistogram(),
      regions: this.analyzeRegions(),
      dynamicRangeAnalysis: this.calculateDynamicRange(),
      gammaCurveAnalysis: this.analyzeGammaCurve(),
      clippingAnalysis: this.detectClipping(),
    };
  }
}

export default LuminanceAnalyzer;
