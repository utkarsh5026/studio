import React, { useCallback, useEffect, useState } from "react";
import { findDominantColors, calculateSaturation } from "./color";
import Stats from "../Stats";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

interface ColorAnalysisProps {
  canvasResult: CanvasResult;
}

const ColorAnalysis: React.FC<ColorAnalysisProps> = ({ canvasResult }) => {
  const [analysis, setAnalysis] = useState<ColorAnalysisResult | null>(null);

  const analyzeColors = useCallback(async () => {
    console.log("Analyzing colors...", canvasResult);
    const { imageData, canvas, context } = canvasResult;

    if (!imageData || !canvas || !context) {
      console.log("Missing required canvas data");
      return;
    }

    const width = imageData.width;
    const height = imageData.height;
    const pixels = context.getImageData(0, 0, width, height).data;

    // Initialize histograms for RGB channels
    const redHist = new Array(256).fill(0);
    const greenHist = new Array(256).fill(0);
    const blueHist = new Array(256).fill(0);

    // Calculate histograms and collect color data
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      redHist[r]++;
      greenHist[g]++;
      blueHist[b]++;
    }

    const dominantColors = await findDominantColors(pixels);
    const saturation = await calculateSaturation(pixels);

    let totalGray = 0;
    const totalPixels = pixels.length / 4;
    let totalRed = 0,
      totalGreen = 0,
      totalBlue = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      totalGray += gray;

      // Color balance calculation
      totalRed += r;
      totalGreen += g;
      totalBlue += b;
    }

    const grayscaleAverage = totalGray / totalPixels;
    const colorBalance = {
      redPercentage: (totalRed / (totalRed + totalGreen + totalBlue)) * 100,
      greenPercentage: (totalGreen / (totalRed + totalGreen + totalBlue)) * 100,
      bluePercentage: (totalBlue / (totalRed + totalGreen + totalBlue)) * 100,
    };

    setAnalysis({
      histograms: {
        red: redHist,
        green: greenHist,
        blue: blueHist,
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

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "red":
        return "#ef4444";
      case "green":
        return "#22c55e";
      case "blue":
        return "#3b82f6";
      default:
        return "#000000";
    }
  };

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
            value={`R:${analysis.colorBalance.redPercentage.toFixed(
              1
            )}% G:${analysis.colorBalance.greenPercentage.toFixed(
              1
            )}% B:${analysis.colorBalance.bluePercentage.toFixed(1)}%`}
          />
        </div>
      </DataCard>

      <DataCard title="RGB Histograms">
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["red", "green", "blue"].map((channel) => (
              <div key={channel} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analysis.histograms[
                      channel as keyof typeof analysis.histograms
                    ].map((value, index) => ({
                      value: value,
                      index: index,
                    }))}
                  >
                    <XAxis dataKey="index" stroke="currentColor" />
                    <YAxis stroke="currentColor" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                        color: "var(--text)",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill={getChannelColor(channel)}
                      opacity={0.8}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </section>
      </DataCard>

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
