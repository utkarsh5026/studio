import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Alert, AlertDescription } from "../../ui/alert";

import type { BandwidthRequirementsAnalysis } from "../../../analysis/performance";
import PerfCard from "./PerfCard";

interface BandwidthRequirementsProps {
  metrics: BandwidthRequirementsAnalysis;
}

const BandwidthRequirements: React.FC<BandwidthRequirementsProps> = ({
  metrics,
}) => {
  const { requirements, recommendation } = metrics;
  return (
    <PerfCard
      title="Network Bandwidth Analysis"
      description="Detailed bandwidth requirements under different scenarios"
    >
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requirements}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="scenario" stroke="currentColor" />
                <YAxis
                  stroke="currentColor"
                  label={{
                    value: "Required Bandwidth (Mbps)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "currentColor" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                />
                <Bar dataKey="bandwidth" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {requirements.map((req) => (
              <div
                key={req.scenario}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <span className="font-medium">{req.scenario}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {req.bandwidth} Mbps required
                </span>
              </div>
            ))}
          </div>

          <Alert
            className={
              requirements[0].bandwidth > 2
                ? "bg-yellow-50 dark:bg-yellow-950"
                : "bg-green-50 dark:bg-green-950"
            }
          >
            <AlertDescription>{recommendation}</AlertDescription>
          </Alert>
        </div>
      </div>
    </PerfCard>
  );
};

export default BandwidthRequirements;
