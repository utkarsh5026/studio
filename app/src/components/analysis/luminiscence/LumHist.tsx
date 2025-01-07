import LuminCard from "./LuminCard";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { HistogramData } from "./types";

interface LumHistProps {
  analysis: HistogramData[];
}

const LumHist = ({ analysis }: LumHistProps) => {
  return (
    <LuminCard
      title="Luminance Histogram"
      description="Detailed visualization of tonal distribution"
      tooltip="A graph showing the distribution of brightness values from 0 (black) to 255 (white). The height of each point shows how many pixels have that brightness level."
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analysis}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="value"
              label={{ value: "Luminance Value", position: "bottom" }}
              ticks={[0, 63, 127, 191, 255]}
            />
            <YAxis
              label={{
                value: "Percentage of Pixels",
                angle: -90,
                position: "insideLeft",
              }}
              ticks={[0, 63, 127, 191, 255]}
            />
            <Tooltip formatter={(value) => `${value}%`} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-5 gap-2 text-xs text-center">
          <div>Shadows (0-63)</div>
          <div>Quarter-tones (64-127)</div>
          <div>Mid-tones (128-191)</div>
          <div>Three-quarter-tones (192-255)</div>
          <div>Highlights (240-255)</div>
        </div>
      </div>
    </LuminCard>
  );
};

export default LumHist;
