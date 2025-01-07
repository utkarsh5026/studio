import type { MemoryUsageAnalysis } from "../../../analysis/performance";
import { Progress } from "../../ui/progress";
import { Alert, AlertDescription } from "../../ui/alert";
import PerfCard from "./PerfCard";

interface MemoryUsageProps {
  metrics: MemoryUsageAnalysis;
}

const MemoryUsage: React.FC<MemoryUsageProps> = ({ metrics }) => {
  const { components, totalMB, assessment } = metrics;
  return (
    <PerfCard
      title="Memory Usage Analysis"
      description="Detailed breakdown of memory consumption"
    >
      <div className="space-y-4">
        {components.map((component) => (
          <div key={component.name} className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">{component.name}</span>
              <span className="text-sm text-muted-foreground">
                {component.size} MB
              </span>
            </div>
            <Progress
              value={(component.size / totalMB) * 100}
              className="h-2"
            />
          </div>
        ))}
        <Alert
          className={
            totalMB > 50
              ? "bg-yellow-50 dark:bg-yellow-950/50"
              : "bg-green-50 dark:bg-green-950/50"
          }
        >
          <AlertDescription>
            Total Memory Usage: {totalMB} MB
            <br />
            {assessment}
          </AlertDescription>
        </Alert>
      </div>
    </PerfCard>
  );
};

export default MemoryUsage;
