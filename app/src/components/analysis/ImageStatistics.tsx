import React, { useState, useCallback, useEffect } from "react";
import {
  calculateAspectRatio,
  formatFileSize,
  calculateAverageLuminance,
} from "../../analysis/base";
import {
  BiRectangle,
  BiExpandAlt,
  BiMemoryCard,
  BiBulb,
  BiFile,
  BiTime,
  BiColorFill,
} from "react-icons/bi";
import Stats from "./Stats";
import type { CanvasResult } from "../../canvas/useCanvas";
import type { ImageInfo } from "../../store/image/types";

interface ImageDetails {
  dimensions: { width: number; height: number };
  aspectRatio: { width: number; height: number };
  fileSize: string;
  fileType: string;
  fileFormat: string;
  luminance: string;
  lastModified: string;
  colorDepth?: number;
  dpi?: number;
  bitsPerChannel?: number;
  channels?: number;
}

interface ImageStatisticsProps {
  imageInfo: ImageInfo;
  canvasResult: CanvasResult;
}

const ImageStatistics: React.FC<ImageStatisticsProps> = ({
  imageInfo,
  canvasResult,
}) => {
  const [details, setDetails] = useState<ImageDetails | null>(null);

  const handleCanvasResult = useCallback(
    (canvasResult: CanvasResult, imageInfo: ImageInfo) => {
      const { canvas, context, imageData, error } = canvasResult;
      if (error || !canvas || !context || !imageData || !imageInfo) {
        console.error(error);
        return;
      }

      const { image: file } = imageInfo;
      setDetails({
        dimensions: { width: canvas.width, height: canvas.height },
        aspectRatio: calculateAspectRatio(canvas.width, canvas.height),
        fileSize: formatFileSize(file.size),
        fileType: file.type,
        fileFormat: file.name.split(".").pop() ?? "",
        luminance: calculateAverageLuminance(
          context,
          canvas.width,
          canvas.height
        ).toFixed(2),
        lastModified: new Date(file.lastModified).toLocaleDateString(),
        colorDepth: 24,
        bitsPerChannel: 8,
        channels: 3,
      });
    },
    []
  );

  useEffect(
    () => handleCanvasResult(canvasResult, imageInfo),
    [handleCanvasResult, canvasResult, imageInfo]
  );

  if (!imageInfo || !details) return null;

  const stats = [
    {
      icon: <BiRectangle className="text-xl" />,
      label: "Dimensions",
      value: `${details.dimensions.width} × ${details.dimensions.height}px`,
    },
    {
      icon: <BiExpandAlt className="text-xl" />,
      label: "Aspect Ratio",
      value: `${details.aspectRatio.width}:${details.aspectRatio.height}`,
    },
    {
      icon: <BiMemoryCard className="text-xl" />,
      label: "File Size",
      value: details.fileSize,
    },
    {
      icon: <BiBulb className="text-xl" />,
      label: "Luminance",
      value: details.luminance,
    },
    {
      icon: <BiFile className="text-xl" />,
      label: "Format",
      value: details.fileFormat.toUpperCase(),
    },
    {
      icon: <BiTime className="text-xl" />,
      label: "Modified",
      value: new Date(imageInfo.image.lastModified).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ),
    },
    {
      icon: <BiColorFill className="text-xl" />,
      label: "Color Depth",
      value: details.colorDepth ? `${details.colorDepth}-bits` : "N/A",
    },
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        Image Statistics
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Stats
            key={`${stat.label}-${index}`}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageStatistics;
