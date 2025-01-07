import React from "react";
import LuminCard from "./LuminCard";
import { Progress } from "../../ui/progress";
import InfoTooltip from "./InfoToolTop";
import type { ClippingAnalysis } from "./types";
import { Alert, AlertDescription } from "../../ui/alert";

interface ClippingAnalysisProps {
  analysis: ClippingAnalysis;
}

const ClippingAnalysisCard: React.FC<ClippingAnalysisProps> = ({
  analysis,
}) => {
  const { shadowClipping, highlightClipping, assessment, recommendations } =
    analysis;
  return (
    <LuminCard
      title="Clipping Analysis"
      description="Detects areas where detail is lost due to extreme brightness or darkness. Clipping indicates loss of detail in shadows or highlights."
      tooltip="Shadow and highlight detail preservation"
    >
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Shadow Clipping</span>
                <span>
                  {shadowClipping}%
                  <InfoTooltip text="Percentage of pixels with no shadow detail (pure black). Values over 5% indicate significant detail loss." />
                </span>
              </div>
              <Progress value={shadowClipping} className="h-2 bg-gray-200" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Highlight Clipping</span>
                <span>
                  {highlightClipping}%
                  <InfoTooltip text="Percentage of pixels with no highlight detail (pure white). Values over 5% indicate significant detail loss." />
                </span>
              </div>
              <Progress value={highlightClipping} className="h-2 bg-gray-200" />
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <p className="mb-2">{assessment}</p>
              <ul className="space-y-1 text-sm">
                {recommendations.map((rec, index) => (
                  <li key={`${index}-${rec}`}>• {rec}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </LuminCard>
  );
};

export default ClippingAnalysisCard;
