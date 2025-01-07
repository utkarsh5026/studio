import { Progress } from "../../ui/progress";
import { Alert, AlertDescription } from "../../ui/alert";

import type { RenderingImpactAnalysis } from "../../../analysis/performance";
import PerfCard from "./PerfCard";

interface RenderingImpactProps {
  metrics: RenderingImpactAnalysis;
}

const RenderingImpact = ({ metrics }: RenderingImpactProps) => {
  const { factors, recommendation } = metrics;
  return (
    <PerfCard
      title="Rendering Performance Impact"
      description="Analysis of potential rendering performance implications"
    >
      <div className="space-y-4">
        Analysis of potential rendering performance implications
        <div className="space-y-4">
          {factors.map((factor) => (
            <div key={factor.name} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{factor.name}</span>
                <span className="text-sm text-gray-600">
                  Impact Score: {Math.round(factor.impact)}
                </span>
              </div>
              <Progress value={factor.impact} className="h-2" />
            </div>
          ))}
          <Alert>
            <AlertDescription>{recommendation}</AlertDescription>
          </Alert>
        </div>
      </div>
    </PerfCard>
  );
};

export default RenderingImpact;
