import React, { useEffect, useState } from "react";
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

interface ImageStatisticsProps {
  image: File | null;
}

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

const ImageStatistics: React.FC<ImageStatisticsProps> = ({ image }) => {
  const [details, setDetails] = useState<ImageDetails | null>(null);

  useEffect(() => {
    if (!image) return;

    const img = new Image();
    img.src = URL.createObjectURL(image);

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    img.onload = () => {
      setDetails({
        dimensions: { width: img.width, height: img.height },
        aspectRatio: calculateAspectRatio(img.width, img.height),
        fileSize: formatFileSize(image.size),
        fileType: image.type,
        fileFormat: image.name.split(".").pop() ?? "",
        luminance: calculateAverageLuminance(
          ctx,
          img.width,
          img.height
        ).toFixed(2),
        lastModified: new Date(image.lastModified).toLocaleDateString(),
        colorDepth: 24,
        bitsPerChannel: 8,
        channels: 3,
      });
      URL.revokeObjectURL(img.src);
    };
  }, [image]);

  if (!image || !details) return null;

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
      value: new Date(image.lastModified).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
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
          <div
            key={`${stat.label}-${index}`}
            className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="text-gray-600 dark:text-gray-300">
                {stat.icon}
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.label}
              </span>
            </div>
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageStatistics;
