const BYTES_TO_MB = 1024 * 1024;
const BYTES_TO_KB = 1024;
const BITS_PER_CHANNEL = 8;

export type ResolutionAnalysis = {
  ratio: number;
  assessment: string;
  recommendation: string;
};

export type LoadingTimeAnalysis = {
  times: Array<{ connection: string; time: number }>;
  assessment: string;
};

export type MemoryUsageAnalysis = {
  totalMB: number;
  components: Array<{ name: string; size: number }>;
  assessment: string;
};

export type RenderingImpactAnalysis = {
  score: number;
  factors: Array<{ name: string; impact: number }>;
  recommendation: string;
};

export type BrowserCompatibilityAnalysis = {
  format: string;
  compatibility: Array<{ browser: string; support: string }>;
  recommendation: string;
};

export type BandwidthRequirementsAnalysis = {
  requirements: Array<{ scenario: string; bandwidth: number }>;
  recommendation: string;
};

/**
 * Analyzes various performance aspects of an image file including resolution,
 * loading time, memory usage, rendering impact, browser compatibility, and bandwidth requirements.
 */
export class ImagePerformanceAnalyzer {
  private readonly image: File;
  private readonly width: number;
  private readonly height: number;
  private readonly fileSize: number;

  /**
   * Creates a new instance of ImagePerformanceAnalyzer
   * @param image - The image file to analyze
   * @param width - The width of the image in pixels
   * @param height - The height of the image in pixels
   */
  constructor(image: File, width: number, height: number) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.fileSize = image.size;
  }

  /**
   * Calculates the ratio between file size and resolution to determine optimization level
   * @returns {ResolutionAnalysis} Analysis containing ratio, assessment, and optimization recommendations
   */
  public calculateResolutionRatio(): ResolutionAnalysis {
    const megapixels = (this.width * this.height) / 1000000;
    const fileSizeMB = this.fileSize / BYTES_TO_MB;
    const ratio = Number((fileSizeMB / megapixels).toFixed(2));

    let assessment = "Optimal";
    let recommendation =
      "Current file size is well-optimized for the resolution";

    if (ratio > 1.5) {
      assessment = "Poor";
      recommendation =
        "Consider applying stronger compression - file size is too large for the resolution";
    } else if (ratio > 0.5) {
      assessment = "Average";
      recommendation =
        "Minor optimization possible - consider light compression";
    }

    return { ratio, assessment, recommendation };
  }

  /**
   * Analyzes estimated loading times across different network connections
   * @returns {LoadingTimeAnalysis} Analysis containing loading times for different connection types and overall assessment
   */
  public analyzeLoadingTime(): LoadingTimeAnalysis {
    const connections = [
      { name: "2G", speed: 50 * 1024 }, // 50 KB/s
      { name: "3G", speed: 750 * BYTES_TO_KB }, // 750 KB/s
      { name: "4G", speed: 4 * BYTES_TO_MB }, // 4 MB/s
      { name: "5G", speed: 20 * BYTES_TO_MB }, // 20 MB/s
      { name: "Fiber", speed: 50 * BYTES_TO_MB }, // 50 MB/s
    ];

    const times = connections.map((conn) => ({
      connection: conn.name,
      time: Number((this.fileSize / conn.speed).toFixed(2)),
    }));

    const assessment =
      this.fileSize > BYTES_TO_MB
        ? "Loading time may be problematic on slower connections"
        : "Loading time is acceptable across most connection types";

    return { times, assessment };
  }

  /**
   * Estimates memory usage when loading and processing the image
   * @returns {MemoryUsageAnalysis} Analysis of memory requirements including raw data, decoded buffer, and processing buffers
   */
  public calculateMemoryUsage(): MemoryUsageAnalysis {
    const bitsPerChannel = 8;
    const channels = 4; // RGBA
    const bytesPerPixel = (bitsPerChannel * channels) / 8;

    const rawSize = this.width * this.height * bytesPerPixel;
    const decodedSize = rawSize * 1.2; // Account for decoded overhead
    const bufferSize = rawSize * 0.5; // Estimate for processing buffers

    const totalBytes = rawSize + decodedSize + bufferSize;
    const totalMB = Number((totalBytes / BYTES_TO_MB).toFixed(2));

    const components = [
      {
        name: "Raw Pixel Data",
        size: Number((rawSize / BYTES_TO_MB).toFixed(2)),
      },
      {
        name: "Decoded Buffer",
        size: Number((decodedSize / BYTES_TO_MB).toFixed(2)),
      },
      {
        name: "Processing Buffers",
        size: Number((bufferSize / BYTES_TO_MB).toFixed(2)),
      },
    ];

    let assessment = "Low memory impact";
    if (totalMB > 100) {
      assessment = "High memory impact - consider resizing";
    } else if (totalMB > 50) {
      assessment = "Moderate memory impact";
    }

    return { totalMB, components, assessment };
  }

  /**
   * Evaluates the potential impact on rendering performance
   * @returns {RenderingImpactAnalysis} Analysis of rendering impact factors including resolution, aspect ratio, and file size
   */
  public evaluateRenderingImpact(): RenderingImpactAnalysis {
    const totalPixels = this.width * this.height;
    const aspectRatio = this.width / this.height;
    const fileSize = this.fileSize;

    // Calculate various impact factors (0-100 scale)
    const factors = [
      {
        name: "Resolution Impact",
        impact: Math.min(100, (totalPixels / 4000000) * 100),
      },
      {
        name: "Aspect Ratio Complexity",
        impact: Math.abs(aspectRatio - 1.78) * 50, // Deviation from 16:9
      },
      {
        name: "Size Impact",
        impact: Math.min(100, (fileSize / (2 * 1024 * 1024)) * 100),
      },
    ];

    const score =
      factors.reduce((acc, factor) => acc + factor.impact, 0) / factors.length;

    let recommendation = "Image should render efficiently";
    if (score > 75) {
      recommendation = "Consider optimizing image dimensions and file size";
    } else if (score > 50) {
      recommendation = "Minor optimizations recommended";
    }

    return { score, factors, recommendation };
  }

  /**
   * Assesses browser compatibility for the image format
   * @returns {BrowserCompatibilityAnalysis} Analysis of browser support and format-specific recommendations
   */
  public assessBrowserCompatibility(): BrowserCompatibilityAnalysis {
    const format = this.image.type.split("/")[1].toUpperCase();

    const compatibility = [
      {
        browser: "Chrome",
        support: this.getBrowserSupport(format, "Chrome"),
      },
      {
        browser: "Firefox",
        support: this.getBrowserSupport(format, "Firefox"),
      },
      {
        browser: "Safari",
        support: this.getBrowserSupport(format, "Safari"),
      },
      {
        browser: "Edge",
        support: this.getBrowserSupport(format, "Edge"),
      },
    ];

    const recommendation = this.getFormatRecommendation(format);

    return { format, compatibility, recommendation };
  }

  /**
   * Determines browser support level for a specific format and browser
   * @param format - Image format (JPEG, PNG, WEBP, AVIF)
   * @param browser - Browser name
   * @returns Support level ("Full", "Partial", "None", or "Unknown")
   */
  private getBrowserSupport(format: string, browser: string): string {
    const support = {
      JPEG: { Chrome: "Full", Firefox: "Full", Safari: "Full", Edge: "Full" },
      PNG: { Chrome: "Full", Firefox: "Full", Safari: "Full", Edge: "Full" },
      WEBP: {
        Chrome: "Full",
        Firefox: "Full",
        Safari: "Partial",
        Edge: "Full",
      },
      AVIF: {
        Chrome: "Full",
        Firefox: "Partial",
        Safari: "None",
        Edge: "Partial",
      },
    };
    return (
      support[format as keyof typeof support]?.[
        browser as keyof (typeof support)[keyof typeof support]
      ] || "Unknown"
    );
  }

  /**
   * Provides format-specific recommendations
   * @param format - Image format (JPEG, PNG, WEBP, AVIF)
   * @returns Recommendation string for the given format
   */
  private getFormatRecommendation(format: string): string {
    const recommendations = {
      JPEG: "Widely supported format, good for photographs",
      PNG: "Widely supported, best for images with transparency",
      WEBP: "Modern format with good compression, consider JPEG fallback",
      AVIF: "Next-gen format, requires fallback for broad support",
    };

    return (
      recommendations[format as keyof typeof recommendations] ||
      "Consider using a more widely supported format"
    );
  }

  /**
   * Calculates bandwidth requirements for different usage scenarios
   * @returns {BandwidthRequirementsAnalysis} Analysis of bandwidth needs across various usage patterns
   */
  public calculateBandwidthRequirements(): BandwidthRequirementsAnalysis {
    const scenarios = [
      { name: "Single Load", multiplier: 1 },
      { name: "Multiple Instances", multiplier: 3 },
      { name: "With Caching", multiplier: 0.2 },
      { name: "Peak Usage", multiplier: 5 },
    ];

    const baseBandwidth = (this.fileSize * BITS_PER_CHANNEL) / BYTES_TO_MB; // Convert to Mbps

    const requirements = scenarios.map((scenario) => ({
      scenario: scenario.name,
      bandwidth: Number((baseBandwidth * scenario.multiplier).toFixed(2)),
    }));

    let recommendation = "Bandwidth requirements are minimal";
    if (baseBandwidth > 5) {
      recommendation =
        "Consider implementing lazy loading and caching strategies";
    } else if (baseBandwidth > 2) {
      recommendation = "Image size is acceptable but monitor usage patterns";
    }

    return { requirements, recommendation };
  }
}
