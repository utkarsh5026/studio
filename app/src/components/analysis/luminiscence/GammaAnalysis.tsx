import LuminCard from "./LuminCard";
import { Progress } from "../../ui/progress";
import { Alert, AlertDescription } from "../../ui/alert";
import InfoTooltip from "./InfoToolTop";
import type { GammaCurveAnalysis } from "./types";

interface GammaAnalysisProps {
  analysis: GammaCurveAnalysis;
}

const GammaAnalysis = ({ analysis }: GammaAnalysisProps) => {
  const { estimatedGamma, idealGamma, correction, assessment } = analysis;
  return (
    <LuminCard
      title="Gamma Analysis"
      description="Brightness encoding and correction analysis"
      tooltip="Analyzes the image's gamma curve, which affects how brightness values are distributed between black and white. Ideal gamma depends on the display device."
    >
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium dark:text-gray-200">
                    Estimated Gamma
                  </span>
                  <span className="text-sm dark:text-gray-300">
                    {estimatedGamma}
                    <InfoTooltip text="Current gamma value of the image. Web standard is 2.2." />
                  </span>
                </div>
                <Progress value={(estimatedGamma / 3) * 100} className="h-2" />
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium dark:text-gray-200">
                    Ideal Gamma
                  </span>
                  <span className="text-sm dark:text-gray-300">
                    {idealGamma}
                    <InfoTooltip text="Target gamma value for web display." />
                  </span>
                </div>
                <Progress value={(idealGamma / 3) * 100} className="h-2" />
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium dark:text-gray-200">
                    Correction Factor
                  </span>
                  <span className="text-sm dark:text-gray-300">
                    {correction}x
                    <InfoTooltip text="Multiplier needed to achieve ideal gamma. Values close to 1 need less correction." />
                  </span>
                </div>
                <Progress value={(1 / correction) * 100} className="h-2" />
              </div>
            </div>
          </div>

          <Alert>
            <AlertDescription>{assessment}</AlertDescription>
          </Alert>
        </div>
      </div>
    </LuminCard>
  );
};

export default GammaAnalysis;
