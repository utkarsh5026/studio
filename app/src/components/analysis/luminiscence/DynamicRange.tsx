import LuminCard from "./LuminCard";
import { Progress } from "../../ui/progress";
import { Alert, AlertDescription } from "../../ui/alert";
import InfoTooltip from "./InfoToolTop";
import type { DynamicRangeAnalysis } from "./types";

interface DynamicRangeProps {
  analysis: DynamicRangeAnalysis;
}

const DynamicRange = ({ analysis }: DynamicRangeProps) => {
  const { range, effectiveRange, zones, assessment } = analysis;
  return (
    <LuminCard
      title="Dynamic Range Analysis"
      description="Tonal range and distribution analysis"
      tooltip="Measures the range between the darkest and lightest parts of the image. A wider range typically means more detail and tonal variation."
    >
      <div className="space-y-6">
        <div className="space-y-6"></div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium dark:text-gray-200">
                    Absolute Range
                  </span>
                  <span className="text-sm dark:text-gray-300">
                    {range}
                    <InfoTooltip text="The complete range from darkest to lightest pixel. Higher values indicate more contrast." />
                  </span>
                </div>
                <Progress value={(range / 255) * 100} className="h-2" />
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium dark:text-gray-200">
                    Effective Range
                  </span>
                  <span className="text-sm dark:text-gray-300">
                    {effectiveRange}
                    <InfoTooltip text="Range excluding extreme outliers. More representative of visible tonal range." />
                  </span>
                </div>
                <Progress
                  value={(effectiveRange / 255) * 100}
                  className="h-2"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {zones.map((zone) => (
              <div key={zone.zone} className="space-y-1">
                <div className="flex justify-between text-sm dark:text-gray-200">
                  <span>{zone.zone}</span>
                  <span>{zone.presence}%</span>
                </div>
                <Progress value={zone.presence} className="h-2" />
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

export default DynamicRange;
