import React from "react";
import { Progress } from "../../ui/progress";
import type { CompressionAnalysis } from "./types";
import DataCard from "../utils/DataCard";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

interface OverviewProps {
  analysisResults: CompressionAnalysis;
}

const Overview: React.FC<OverviewProps> = ({ analysisResults }) => {
  const { currentCompression, qualityImpact, losslessPotential } =
    analysisResults;
  return (
    <DataCard title="Compression Analysis Overview">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-blue-800 dark:text-blue-200">
              Current Compression
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Shows how much your image is currently compressed compared
                    to its original size
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="mt-2">
            <Progress
              value={currentCompression.currentLevel}
              className="h-2 bg-blue-200 dark:bg-blue-800"
            />
            <p className="mt-1 text-sm text-blue-600 dark:text-blue-300">
              {currentCompression.currentLevel}% compressed
            </p>
          </div>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-green-800 dark:text-green-200">
              Quality Score
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Indicates the visual quality of the image after compression
                    (100 = perfect quality)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="mt-2">
            <Progress
              value={qualityImpact.qualityScore}
              className="h-2 bg-green-200 dark:bg-green-800"
            />
            <p className="mt-1 text-sm text-green-600 dark:text-green-300">
              {qualityImpact.qualityScore}/100
            </p>
          </div>
        </div>

        <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-purple-800 dark:text-purple-200">
              Lossless Potential
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Estimated additional compression possible without losing
                    image quality
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="mt-2">
            <Progress
              value={losslessPotential.potential}
              className="h-2 bg-purple-200 dark:bg-purple-800"
            />
            <p className="mt-1 text-sm text-purple-600 dark:text-purple-300">
              {losslessPotential.potential}% potential savings
            </p>
          </div>
        </div>
      </div>
    </DataCard>
  );
};

export default Overview;
