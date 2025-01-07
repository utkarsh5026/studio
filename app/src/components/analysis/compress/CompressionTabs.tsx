import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Alert, AlertDescription } from "../../ui/alert";
import { Progress } from "../../ui/progress";
import DataCard from "../utils/DataCard";

import type { CompressionAnalysis } from "./types";

interface CompressionTabsProps {
  analysisResults: CompressionAnalysis;
}

const CompressionTabs: React.FC<CompressionTabsProps> = ({
  analysisResults,
}) => {
  return (
    <Tabs defaultValue="formats" className="w-full">
      <TabsList className="grid grid-cols-4 gap-4 p-1">
        <TabsTrigger value="formats">Format Analysis</TabsTrigger>
        <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
        <TabsTrigger value="quality">Quality Impact</TabsTrigger>
        <TabsTrigger value="lossless">Lossless Analysis</TabsTrigger>
      </TabsList>

      {/* Format Analysis Tab */}
      <TabsContent value="formats">
        <DataCard title="Format Comparison">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysisResults.formatPotential}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="dark:opacity-50"
                />
                <XAxis dataKey="format" className="dark:text-gray-300" />
                <YAxis
                  label={{
                    value: "Potential Savings (%)",
                    angle: -90,
                    className: "dark:text-gray-300",
                  }}
                  className="dark:text-gray-300"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(var(--background))",
                    border: "1px solid rgb(var(--border))",
                  }}
                  labelStyle={{
                    color: "rgb(var(--foreground))",
                  }}
                />
                <Bar
                  dataKey="potentialSavings"
                  fill="#4F46E5"
                  className="dark:fill-indigo-400"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {analysisResults.formatPotential.map((format) => (
              <div
                key={format.format}
                className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <span className="font-medium dark:text-gray-200">
                  {format.format}
                </span>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span>{format.potentialSavings}% savings</span>
                  <span className="mx-2">|</span>
                  <span>{(format.estimatedFileSize / 1024).toFixed(1)} KB</span>
                </div>
              </div>
            ))}
          </div>
        </DataCard>
      </TabsContent>

      {/* Artifacts Tab */}
      <TabsContent value="artifacts">
        <DataCard title="Compression Artifacts Analysis">
          <div className="space-y-4">
            <Alert
              className={`${
                analysisResults.artifacts.severity > 50
                  ? "bg-red-900/20"
                  : "bg-green-900/20"
              }`}
            >
              <AlertDescription className="text-foreground">
                Artifact Severity: {analysisResults.artifacts.severity}%
                {analysisResults.artifacts.severity > 50 &&
                  " - Consider using a higher quality setting"}
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary rounded-lg">
                <h3 className="font-medium">Blockiness Score</h3>
                <Progress
                  value={analysisResults.artifacts.blockiness * 100}
                  className="mt-2"
                />
                <p className="mt-1 text-sm text-muted-foreground">
                  {(analysisResults.artifacts.blockiness * 100).toFixed(1)}%
                  detected
                </p>
              </div>

              <div className="p-4 bg-secondary rounded-lg">
                <h3 className="font-medium">Affected Area</h3>
                <Progress
                  value={analysisResults.artifacts.affectedArea * 100}
                  className="mt-2"
                />
                <p className="mt-1 text-sm text-muted-foreground">
                  {(analysisResults.artifacts.affectedArea * 100).toFixed(1)}%
                  of image
                </p>
              </div>
            </div>
          </div>
        </DataCard>
      </TabsContent>

      {/* Quality Impact Tab */}
      <TabsContent value="quality">
        <DataCard title="Quality Impact Assessment">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium dark:text-gray-200">
                  PSNR (Peak Signal-to-Noise Ratio)
                </h3>
                <div className="mt-2">
                  <Progress
                    value={(analysisResults.qualityImpact.psnr / 50) * 100}
                    className="h-2"
                  />
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {analysisResults.qualityImpact.psnr.toFixed(1)} dB
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium dark:text-gray-200">
                  SSIM (Structural Similarity)
                </h3>
                <div className="mt-2">
                  <Progress
                    value={analysisResults.qualityImpact.ssim * 100}
                    className="h-2"
                  />
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {analysisResults.qualityImpact.ssim.toFixed(3)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium mb-4 dark:text-gray-200">
                Visual Impact Assessment
              </h3>
              <div
                className={`p-4 rounded-lg ${
                  analysisResults.qualityImpact.visualImpact === "Minimal"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : analysisResults.qualityImpact.visualImpact ===
                      "Noticeable"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                <p className="font-medium">
                  {analysisResults.qualityImpact.visualImpact}
                </p>
                <p className="mt-2 text-sm">
                  Quality Score: {analysisResults.qualityImpact.qualityScore}
                  /100
                </p>
              </div>
            </div>
          </div>
        </DataCard>
      </TabsContent>

      {/* Lossless Analysis Tab */}
      <TabsContent value="lossless">
        <DataCard title="Lossless Compression Analysis">
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium mb-2 dark:text-gray-200">
                Compression Potential
              </h3>
              <Progress
                value={analysisResults.losslessPotential.potential}
                className="h-2"
              />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {analysisResults.losslessPotential.potential}% potential for
                lossless compression
              </p>
            </div>

            <Alert className="bg-blue-50 dark:bg-blue-950/50">
              <AlertDescription className="text-blue-800 dark:text-blue-400">
                {analysisResults.losslessPotential.recommendation}
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium dark:text-gray-200">
                  Entropy Score
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {analysisResults.losslessPotential.entropy.toFixed(2)}{" "}
                  bits/pixel
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium dark:text-gray-200">
                  Estimated Savings
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {(
                    analysisResults.losslessPotential.estimatedSavings / 1024
                  ).toFixed(1)}{" "}
                  KB
                </p>
              </div>
            </div>
          </div>
        </DataCard>
      </TabsContent>
    </Tabs>
  );
};

export default CompressionTabs;
