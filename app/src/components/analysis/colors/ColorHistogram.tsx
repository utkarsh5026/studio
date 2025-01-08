import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import DataCard from "../utils/DataCard";

interface ColorHistogramProps {
  histograms: {
    red: number[];
    green: number[];
    blue: number[];
  };
}

const ColorHistogram: React.FC<ColorHistogramProps> = ({ histograms }) => {
  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "red":
        return "#ef4444";
      case "green":
        return "#22c55e";
      case "blue":
        return "#3b82f6";
      default:
        return "#000000";
    }
  };

  return (
    <DataCard title="RGB Histograms">
      <section className="space-y-4">
        <div className="h-64 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={Array.from({ length: 256 }, (_, index) => ({
                index,
                red: histograms.red[index],
                green: histograms.green[index],
                blue: histograms.blue[index],
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="index"
                stroke="currentColor"
                label={{ value: "Intensity", position: "bottom", offset: 0 }}
              />
              <YAxis
                stroke="currentColor"
                label={{
                  value: "Pixel Count",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                  padding: "10px",
                  borderRadius: "6px",
                }}
                formatter={(value: number, name: string) => [
                  value.toLocaleString(),
                  name.charAt(0).toUpperCase() + name.slice(1),
                ]}
                labelFormatter={(label) => `Intensity: ${label}`}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="red"
                fill="#ef4444"
                opacity={0.6}
                stackId="stack"
                name="Red"
              />
              <Bar
                dataKey="green"
                fill="#22c55e"
                opacity={0.6}
                stackId="stack"
                name="Green"
              />
              <Bar
                dataKey="blue"
                fill="#3b82f6"
                opacity={0.6}
                stackId="stack"
                name="Blue"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["red", "green", "blue"].map((channel) => (
            <div key={channel} className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={histograms[channel as keyof typeof histograms].map(
                    (value, index) => ({
                      value: value,
                      index: index,
                    })
                  )}
                >
                  <XAxis dataKey="index" stroke="currentColor" />
                  <YAxis stroke="currentColor" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      color: "var(--text)",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill={getChannelColor(channel)}
                    opacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </section>
    </DataCard>
  );
};

export default ColorHistogram;
