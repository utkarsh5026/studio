import React, { useState, useCallback, useEffect } from "react";
import { formatFileSize } from "../../analysis/base";
import {
  BiRectangle,
  BiExpandAlt,
  BiMemoryCard,
  BiBulb,
  BiFile,
  BiTime,
  BiColorFill,
} from "react-icons/bi";
import Stats from "./utils/Stats";
import DataCard from "./utils/DataCard";
import type { CanvasResult } from "../../canvas/useCanvas";
import type { ImageInfo } from "../../store/image/types";
import { analyzeImage } from "../../wasm/base";

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
    async (canvasResult: CanvasResult, imageInfo: ImageInfo) => {
      const { canvas, context, imageData, error } = canvasResult;
      if (error || !canvas || !context || !imageData || !imageInfo) {
        console.error(error);
        return;
      }

      const { image: file } = imageInfo;
      const result = await analyzeImage(
        canvas.width,
        canvas.height,
        file.size,
        new Uint8Array(imageData.data.buffer)
      );

      const { aspectRatio, luminance } = result;

      setDetails({
        dimensions: { width: canvas.width, height: canvas.height },
        aspectRatio: aspectRatio,
        fileSize: formatFileSize(file.size),
        fileType: file.type,
        fileFormat: file.name.split(".").pop() ?? "",
        luminance: luminance.toString(),
        lastModified: new Date(file.lastModified).toLocaleDateString(),
        colorDepth: 24,
        bitsPerChannel: 8,
        channels: 3,
      });
    },
    []
  );

  useEffect(() => {
    handleCanvasResult(canvasResult, imageInfo);
  }, [handleCanvasResult, canvasResult, imageInfo]);

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
    <DataCard title="Image Statistics">
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
    </DataCard>
  );
};

export default ImageStatistics;
