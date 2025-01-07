import React from "react";
import LuminCard from "./LuminCard";
import { Progress } from "../../ui/progress";
import InfoTooltip from "./InfoToolTop";
import type { BrightnessDistribution } from "./types";
import { Alert, AlertDescription } from "../../ui/alert";

interface BrightnessDistributionProps {
  analysis: BrightnessDistribution;
}

const BrightnessDistributionCard: React.FC<BrightnessDistributionProps> = ({
  analysis,
}) => {
  const { distribution, meanBrightness, assessment } = analysis;
  return (
    <LuminCard
      title="Brightness Distribution"
      description="Analyzes how light and dark values are distributed across the image, indicating overall exposure and contrast."
      tooltip="Overall luminance characteristics and balance"
    >
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Mean Brightness</span>
            <span className="text-sm">
              {meanBrightness}
              <InfoTooltip text="Values range from 0 (black) to 255 (white). Ideal range is typically 85-170 for balanced exposure." />
            </span>
          </div>

          <div className="space-y-4">
            {distribution.map((range) => (
              <div key={range.range} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{range.range}</span>
                  <span>{range.percentage}%</span>
                </div>
                <Progress value={range.percentage} className="h-2" />
              </div>
            ))}
          </div>

          <Alert>
            <AlertDescription>{assessment}</AlertDescription>
          </Alert>
        </div>
      </div>
    </LuminCard>
  );
};

export default BrightnessDistributionCard;
