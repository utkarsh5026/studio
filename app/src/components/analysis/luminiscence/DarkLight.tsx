import { Progress } from "../../ui/progress";
import LuminCard from "./LuminCard";
import { Alert, AlertDescription } from "../../ui/alert";
import type { RegionAnalysis } from "./types";

interface DarkLightProps {
  analysis: RegionAnalysis;
}

const DarkLight = ({ analysis }: DarkLightProps) => {
  const { darkRegions, lightRegions, assessment } = analysis;
  return (
    <LuminCard
      title="Region Analysis"
      description="Analysis of shadow and highlight areas"
      tooltip="Identifies and analyzes the distribution of very dark (shadows) and very bright (highlights) areas in the image, helping assess exposure balance and detail preservation."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Dark Regions</span>
                    <span>{darkRegions.percentage}%</span>
                  </div>
                  <Progress value={darkRegions.percentage} className="h-2" />
                  <p className="text-sm text-gray-600">
                    {darkRegions.significance}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Light Regions</span>
                    <span>{lightRegions.percentage}%</span>
                  </div>
                  <Progress value={lightRegions.percentage} className="h-2" />
                  <p className="text-sm text-gray-600">
                    {lightRegions.significance}
                  </p>
                </div>
              </div>

              <Alert>
                <AlertDescription>{assessment}</AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </LuminCard>
  );
};

export default DarkLight;
