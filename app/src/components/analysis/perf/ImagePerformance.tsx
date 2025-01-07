import React, { useState, useEffect } from "react";
import { Progress } from "../../ui/progress";
import { Alert, AlertDescription } from "../../ui/alert";
import { ImagePerformanceAnalyzer } from "../../../analysis/performance";
import { ImageInfo } from "../../../store/image/types";
import ResolutionRatio from "./ResolutionRatio";
import LoadingTime from "./LoadingTime";
import MemoryUsage from "./MemoryUsage";
import BrowserCompatibility from "./BrowserCompatibility";
import BandwidthRequirements from "./BandwidthRequirements";
import RenderingImpact from "./RenderingImpact";
import PerfCard from "./PerfCard";
import Container from "../utils/Container";
import type { Metrics } from "../../../analysis/performance";

interface ImagePerformanceMetricsProps {
  imageFile: ImageInfo;
}

const ImagePerformanceMetrics: React.FC<ImagePerformanceMetricsProps> = ({
  imageFile,
}) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    const analyzeImage = async () => {
      const { image, dimensions } = imageFile;
      if (!image || !dimensions) return;

      const img = new Image();
      img.src = URL.createObjectURL(image);

      img.onload = () => {
        const analyzer = new ImagePerformanceAnalyzer(
          image,
          dimensions.width,
          dimensions.height
        );

        setMetrics(analyzer.getMetrics());
      };
    };

    analyzeImage();
  }, [imageFile]);

  if (!metrics) {
    return (
      <div className="text-center p-4">Analyzing image performance...</div>
    );
  }

  return (
    <Container>
      <ResolutionRatio metrics={metrics.resolutionRatio} />
      <LoadingTime metrics={metrics.loadingTime} />
      <MemoryUsage metrics={metrics.memoryUsage} />

      <RenderingImpact metrics={metrics.renderingImpact} />

      <BrowserCompatibility metrics={metrics.browserCompatibility} />
      <BandwidthRequirements metrics={metrics.bandwidthRequirements} />

      {/* Summary and Recommendations */}
      <PerfCard
        title="Performance Summary"
        description="Overall assessment and key recommendations"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium mb-2 dark:text-gray-200">
                Key Metrics
              </h3>
              <ul className="space-y-2 text-sm dark:text-gray-300">
                <li className="flex justify-between">
                  <span>File Size</span>
                  <span className="font-medium dark:text-gray-200">
                    {(imageFile.image.size / 1024).toFixed(1)} KB
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Dimensions</span>
                  <span className="font-medium dark:text-gray-200">
                    {metrics.memoryUsage.components[0].size} MP
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Memory Usage</span>
                  <span className="font-medium dark:text-gray-200">
                    {metrics.memoryUsage.totalMB} MB
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Format</span>
                  <span className="font-medium dark:text-gray-200">
                    {metrics.browserCompatibility.format}
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <h3 className="font-medium mb-2 text-blue-800 dark:text-blue-200">
                Performance Score
              </h3>
              <div className="space-y-2">
                <Progress
                  value={100 - metrics.renderingImpact.score}
                  className="h-2"
                />
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  {100 - Math.round(metrics.renderingImpact.score)}% Optimal
                </p>
              </div>
            </div>
          </div>

          <Alert className="dark:bg-gray-800 dark:border-gray-700">
            <AlertDescription className="space-y-2 dark:text-gray-200">
              <p className="font-medium">Key Recommendations:</p>
              <ul className="space-y-1 text-sm dark:text-gray-300">
                <li>• {metrics.resolutionRatio.recommendation}</li>
                <li>• {metrics.renderingImpact.recommendation}</li>
                <li>• {metrics.bandwidthRequirements.recommendation}</li>
                <li>• {metrics.browserCompatibility.recommendation}</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </PerfCard>
    </Container>
  );
};

export default ImagePerformanceMetrics;
