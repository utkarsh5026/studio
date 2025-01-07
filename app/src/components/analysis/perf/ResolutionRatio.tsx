import React from "react";
import { Progress } from "../../ui/progress";
import { Alert, AlertDescription } from "../../ui/alert";
import type { ResolutionAnalysis } from "../../../analysis/performance";
import PerfCard from "./PerfCard";

interface ResolutionRatioProps {
  metrics: ResolutionAnalysis;
}

const assessmentStyles = {
  Optimal:
    "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
  Average:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
  Poor: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
} as const;

const ResolutionRatio: React.FC<ResolutionRatioProps> = ({ metrics }) => {
  const { ratio, assessment, recommendation } = metrics;
  return (
    <PerfCard
      title="Resolution to File Size Ratio"
      description="Analyzes the relationship between image dimensions and file size"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Ratio Score</span>
          <span
            className={`px-2 py-1 rounded text-sm ${
              assessmentStyles[assessment as keyof typeof assessmentStyles]
            }`}
          >
            {assessment}
          </span>
        </div>
        <Progress value={100 - ratio * 50} className="h-2" />
        <Alert>
          <AlertDescription>{recommendation}</AlertDescription>
        </Alert>
      </div>
    </PerfCard>
  );
};

export default ResolutionRatio;
