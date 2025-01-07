import React from "react";
import { QualityAnalysis } from "../../analysis/quality";
import type { ImageInfo } from "../../store/image/types";

interface QualityMetricsProps {
  image: ImageInfo;
}

interface MetricItem {
  label: string;
  value: string | number;
  description: string;
}

export const QualityMetrics: React.FC<QualityMetricsProps> = ({ image }) => {
  const qa = new QualityAnalysis(
    image.image,
    image.dimensions?.width ?? 0,
    image.dimensions?.height ?? 0
  );

  const metrics: MetricItem[] = [
    {
      label: "Size/Resolution Ratio",
      value: `${qa.calculateFileSizeRatio()} MB/MP`,
      description:
        "File size per megapixel. Lower values indicate better optimization.",
    },
    {
      label: "Loading Time (3G)",
      value: `${qa.estimateLoadingTime()}s`,
      description: "Estimated loading time on standard 3G connection.",
    },
    {
      label: "Memory Usage",
      value: `${qa.calculateMemoryUsage()} MB`,
      description: "Estimated RAM usage when image is loaded.",
    },
    {
      label: "Rendering Impact",
      value: qa.estimateRenderingImpact(),
      description: "Potential impact on browser rendering performance.",
    },
    {
      label: "Bandwidth Required",
      value: `${qa.calculateBandwidth()} Mbps`,
      description: "Minimum bandwidth needed for 1-second load time.",
    },
    {
      label: "Network Transfer",
      value: `${qa.calculateNetworkTransfer()} KB`,
      description: "Total data transfer size over network.",
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Performance Metrics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={`${metric.label}-${index}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 
                     hover:shadow-lg transition-all duration-300 
                     border border-gray-100 dark:border-gray-700"
          >
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2 block">
              {metric.label}
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 my-3 block">
              {metric.value}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {metric.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
