import React, { useCallback, useEffect, useState } from "react";
import {
  findDominantColors,
  findSaturation,
  analyzeImageColors,
} from "../../../wasm/base";
import Stats from "../utils/Stats";
import {
  BsPalette,
  BsAspectRatio,
  BsDroplet,
  BsCircleHalf,
} from "react-icons/bs";

import type { ColorAnalysisResult } from "./types";
import type { CanvasResult } from "../../../canvas/useCanvas";
import LoadingCard from "../utils/LoadingCard";
import Container from "../utils/Container";
import DataCard from "../utils/DataCard";
import ColorHistogram from "./ColorHistogram";

interface ColorAnalysisProps {
  canvasResult: CanvasResult;
}

const ColorAnalysis: React.FC<ColorAnalysisProps> = ({ canvasResult }) => {
  const [analysis, setAnalysis] = useState<ColorAnalysisResult | null>(null);

  const analyzeColors = useCallback(async () => {
    const { imageData, canvas, context } = canvasResult;

    if (!imageData || !canvas || !context) {
      console.log("Missing required canvas data");
      return;
    }

    const width = imageData.width;
    const height = imageData.height;
    const pixels = context.getImageData(0, 0, width, height).data;

    const pixelsArray = new Uint8Array(pixels);
    const dominantColors = await findDominantColors(pixelsArray, 5, 10);
    const saturation = await findSaturation(pixelsArray);
    const { histograms, balance, grayscaleAverage } = await analyzeImageColors(
      pixelsArray
    );

    // Convert Uint32Arrays to regular arrays
    const convertedHistograms = {
      red: Array.from(histograms.red),
      green: Array.from(histograms.green),
      blue: Array.from(histograms.blue),
    };

    const colorBalance = balance;

    setAnalysis({
      histograms: convertedHistograms as {
        red: number[];
        green: number[];
        blue: number[];
      },
      dominantColors,
      saturation,
      dimensions: { width, height },
      grayscalePercentage: (grayscaleAverage / 255) * 100,
      colorBalance,
      colorSpace: "sRGB", // Web browsers typically use sRGB
    });
  }, [canvasResult]);

  useEffect(() => {
    analyzeColors();
  }, [analyzeColors]);

  if (!analysis) return <LoadingCard message="Analyzing colors..." />;

  return (
    <Container>
      <DataCard title="Color Analysis">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stats
            icon={<BsAspectRatio />}
            label="Dimensions"
            value={`${analysis.dimensions.width} × ${analysis.dimensions.height}`}
          />
          <Stats
            icon={<BsPalette />}
            label="Dominant Colors"
            value={`${analysis.dominantColors.length} colors`}
          />
          <Stats
            icon={<BsDroplet />}
            label="Saturation"
            value={`${(analysis.saturation * 100).toFixed(1)}%`}
          />
          <Stats
            icon={<BsCircleHalf />}
            label="Grayscale Average"
            value={`${analysis.grayscalePercentage.toFixed(1)}%`}
          />
          <Stats
            icon={<BsPalette />}
            label="Color Space"
            value={analysis.colorSpace}
          />
          <Stats
            icon={<BsCircleHalf />}
            label="Color Balance"
            value={
              <div className="w-full">
                <div className="flex h-4 w-full rounded-full overflow-hidden">
                  <div
                    className="transition-all duration-300"
                    style={{
                      width: `${analysis.colorBalance.redPercentage}%`,
                      backgroundColor: "#ef4444",
                    }}
                  />
                  <div
                    className="transition-all duration-300"
                    style={{
                      width: `${analysis.colorBalance.greenPercentage}%`,
                      backgroundColor: "#22c55e",
                    }}
                  />
                  <div
                    className="transition-all duration-300"
                    style={{
                      width: `${analysis.colorBalance.bluePercentage}%`,
                      backgroundColor: "#3b82f6",
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1 text-gray-600 dark:text-gray-400">
                  <span>
                    R: {analysis.colorBalance.redPercentage.toFixed(1)}%
                  </span>
                  <span>
                    G: {analysis.colorBalance.greenPercentage.toFixed(1)}%
                  </span>
                  <span>
                    B: {analysis.colorBalance.bluePercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            }
          />
        </div>
      </DataCard>

      <ColorHistogram histograms={analysis.histograms} />

      <DataCard title="Dominant Colors">
        <section className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {analysis.dominantColors.map((color, index) => (
              <div
                key={`${color.r}-${color.g}-${color.b}-${index}`}
                className="flex flex-col items-center"
              >
                <div
                  className="w-8 h-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                  style={{
                    backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                  }}
                />
                <span className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                  rgb({color.r}, {color.g}, {color.b})
                </span>
              </div>
            ))}
          </div>
        </section>
      </DataCard>
    </Container>
  );
};

export default ColorAnalysis;
