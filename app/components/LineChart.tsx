"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Line,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { textToSpeech } from "../../lib/tts"; // Assuming this path is correct

export type LineChartProps = {
  chartData?: { [key: string]: number | string }[];
  onComplete?: () => void;
  xAxisKey?: string;
  yAxisKey?: string;
  lineColor?: string;
  audioEnabled?: boolean;
};

const defaultChartData: LineChartProps["chartData"] = [
  {
    month: "January",
    desktop: 186,
    audio: "In January, desktop users were at 186.",
  },
  { month: "February", desktop: 305, audio: "In February, this grew to 305." },
  { month: "March", desktop: 237, audio: "In March, it dipped to 237." },
  {
    month: "April",
    desktop: 73,
    audio: "In April, there was a sharp drop to 73.",
  },
  { month: "May", desktop: 209, audio: "In May, usage recovered to 209." },
  { month: "June", desktop: 214, audio: "And in June, it settled at 214." },
];

// A custom dot to highlight the most recent point
const CustomizedDot = (props: any) => {
  const { cx, cy, payload, lineColor } = props;
  if (payload.isCurrentPoint) {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={8}
          stroke={lineColor}
          strokeWidth={2}
          fill="#fff"
        />
        <circle cx={cx} cy={cy} r={4} fill={lineColor} />
      </g>
    );
  }
  return <circle cx={cx} cy={cy} r={3} fill={lineColor} />;
};

const LineChart = ({
  chartData = defaultChartData,
  onComplete,
  xAxisKey = "month",
  yAxisKey = "desktop",
  lineColor = "#8884d8",
  audioEnabled = true,
}: LineChartProps) => {
  console.log("LineChart props:", { chartData, xAxisKey, yAxisKey, lineColor });
  const [data, setData] = useState<typeof defaultChartData>([]);
  const [currentPointIndex, setCurrentPointIndex] = useState(-1);
  const [isNarrating, setIsNarrating] = useState(false);

  const handleNarrationComplete = useCallback(() => {
    setIsNarrating(false);
    setCurrentPointIndex((prev) => prev + 1);
  }, []);

  const speakPointData = useCallback(
    async (pointData: (typeof defaultChartData)[0]) => {
      if (!audioEnabled || !pointData.audio) {
        setTimeout(() => setCurrentPointIndex((prev) => prev + 1), 800);
        return;
      }
      setIsNarrating(true);
      try {
        await textToSpeech(pointData.audio as string, handleNarrationComplete);
      } catch (error) {
        console.error("Text-to-speech error:", error);
        handleNarrationComplete();
      }
    },
    [audioEnabled, handleNarrationComplete]
  );

  useEffect(() => {
    if (!chartData || chartData.length === 0) return;
    setData([]);
    setCurrentPointIndex(-1);
    setIsNarrating(false);
    const startTimeout = setTimeout(() => {
      setCurrentPointIndex(0);
    }, 500);
    return () => clearTimeout(startTimeout);
  }, [chartData]);

  useEffect(() => {
    if (!chartData || currentPointIndex < 0) return;
    if (currentPointIndex >= chartData.length) {
      setCurrentPointIndex(-1);
      setIsNarrating(false);
      onComplete?.();
      return;
    }
    const currentPointData = chartData.slice(0, currentPointIndex + 1);
    setData(currentPointData);

    const narrationTimeout = setTimeout(() => {
      speakPointData(chartData[currentPointIndex]);
    }, 300);
    return () => clearTimeout(narrationTimeout);
  }, [currentPointIndex, chartData, speakPointData, onComplete]);

  const transformedData = useMemo(() => {
    const filtered = data.filter(
      (item) =>
        item && item[xAxisKey] !== undefined && item[yAxisKey] !== undefined
    );

    const transformed = filtered.map((item, index) => ({
      ...item,
      [xAxisKey]: item[xAxisKey],
      [yAxisKey]: Number(item[yAxisKey]), // Ensure yAxisKey is a number
      isCurrentPoint: index === currentPointIndex,
    }));

    console.log("LineChart transformedData:", transformed);
    return transformed;
  }, [data, xAxisKey, yAxisKey, currentPointIndex]);

  return (
    <div className="w-full h-96 rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ strokeDasharray: "3 3" }}
          />
          <Line
            type="monotone"
            dataKey={yAxisKey}
            stroke={lineColor}
            strokeWidth={2}
            dot={<CustomizedDot lineColor={lineColor} />}
            activeDot={{ r: 8 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white dark:bg-black border-2 border-black dark:border-white">
        <p className="label text-black dark:text-white">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default LineChart;
