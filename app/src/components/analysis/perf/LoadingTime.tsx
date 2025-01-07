import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { LoadingTimeAnalysis } from "../../../analysis/performance";
import PerfCard from "./PerfCard";
import { Alert, AlertDescription } from "../../ui/alert";

interface LoadingTimeProps {
  metrics: LoadingTimeAnalysis;
}

const LoadingTime: React.FC<LoadingTimeProps> = ({ metrics }) => {
  const { times, assessment } = metrics;
  return (
    <PerfCard
      title="Loading Time Analysis"
      description="Estimated loading times across different network conditions"
    >
      <div className="h-64">
        Estimated loading times across different network conditions
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={times}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="connection" />
              <YAxis
                label={{
                  value: "Load Time (seconds)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Line type="monotone" dataKey="time" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <Alert className="mt-4">
          <AlertDescription>{assessment}</AlertDescription>
        </Alert>
      </div>
    </PerfCard>
  );
};

export default LoadingTime;
