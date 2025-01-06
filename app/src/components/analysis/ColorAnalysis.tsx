import React, { useEffect, useState } from "react";
import type { ColorAnalysisResult } from "../../analysis/types";
import { findDominantColors, calculateSaturation } from "../../analysis/color";
import Stats from "./Stats";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BsPalette, BsAspectRatio, BsDroplet } from "react-icons/bs";

interface ColorAnalysisProps {
  imageData: File;
}

export const ColorAnalysis: React.FC<ColorAnalysisProps> = ({ imageData }) => {
  const [analysis, setAnalysis] = useState<ColorAnalysisResult | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = URL.createObjectURL(imageData);
    analyzeColors(img);
  }, [imageData]);

  const analyzeColors = (img: HTMLImageElement) => {
    // Create canvas and get context
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Wait for image to load
    img.onload = () => {
      if (!ctx) return;

      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image to canvas
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      const width = imageData.width;
      const height = imageData.height;

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

      // Calculate dominant colors using a simple frequency approach
      const dominantColors = findDominantColors(pixels);

      console.log(dominantColors);

      // Calculate average saturation
      const saturation = calculateSaturation(pixels);

      setAnalysis({
        histograms: {
          red: redHist,
          green: greenHist,
          blue: blueHist,
        },
        dominantColors,
        saturation,
        dimensions: { width, height },
      });
    };
  };

  return (
    <div className="color-analysis space-y-6">
      {analysis && (
        <>
          <h2 className="text-2xl font-bold mb-4">Color Analysis Results</h2>

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
          </div>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">RGB Histograms</h3>
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
                      <XAxis dataKey="index" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill={`${channel}`} opacity={0.8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Dominant Colors</h3>
            <div className="flex flex-wrap gap-4">
              {analysis.dominantColors.map((color, index) => (
                <div
                  key={`${color.r}-${color.g}-${color.b}-${index}`}
                  className="flex flex-col items-center"
                >
                  <div
                    className="w-16 h-16 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
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
        </>
      )}
    </div>
  );
};
