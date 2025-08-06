"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Bar,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";
import { useSpeechSynthesis } from "../../lib/hooks/useSpeechSynthesis";

export type BarChartProps = {
  chartData?: { [key: string]: number | string }[];
  onComplete?: () => void;
  xAxisKey?: string;
  yAxisKey?: string;
  barColor?: string;
  audioEnabled?: boolean;
};

const defaultChartData: BarChartProps["chartData"] = [
  {
    month: "January",
    desktop: 186,
    mobile: 100,
    audio: "for January we have 186 desktop users",
  },
  {
    month: "February",
    desktop: 305,
    mobile: 100,
    audio: "for February we have 305 desktop users",
  },
  {
    month: "March",
    desktop: 237,
    mobile: 100,
    audio: "for March we have 237 desktop users",
  },
  {
    month: "April",
    desktop: 73,
    mobile: 100,
    audio: "for April we have 73 desktop users",
  },
  {
    month: "May",
    desktop: 209,
    mobile: 100,
    audio: "for May we have 209 desktop users",
  },
  {
    month: "June",
    desktop: 214,
    mobile: 100,
    audio: "for June we have 214 desktop users",
  },
];

const BarChart = ({
  chartData = defaultChartData,
  onComplete,
  xAxisKey = "month",
  yAxisKey = "desktop",
  barColor = "#8884d8",
  audioEnabled = true,
}: BarChartProps) => {
  const [data, setData] = useState<typeof defaultChartData>([]);
  const [currentBarIndex, setCurrentBarIndex] = useState(-1);
  const [isNarrating, setIsNarrating] = useState(false);

  const { speak, cancel, isSupported } = useSpeechSynthesis({
    rate: 0.9,
    pitch: 1,
    volume: 0.8,
  });

  const handleNarrationComplete = useCallback(() => {
    setIsNarrating(false);
    // Move to next bar after audio completes
    setCurrentBarIndex((prev) => prev + 1);
  }, []);

  const speakBarData = useCallback(
    (barData: (typeof defaultChartData)[0]) => {
      if (!audioEnabled || !isSupported || !barData.audio) {
        // If audio is disabled or not supported, move to next bar after a short delay
        setTimeout(() => setCurrentBarIndex((prev) => prev + 1), 800);
        return;
      }

      setIsNarrating(true);
      speak(barData.audio as string, handleNarrationComplete);
    },
    [audioEnabled, isSupported, speak, handleNarrationComplete]
  );

  // Initialize chart data and start animation
  useEffect(() => {
    if (!chartData || chartData.length === 0) return;

    setData([]);
    setCurrentBarIndex(-1);
    setIsNarrating(false);
    cancel();

    // Start with first bar after a short delay
    const startTimeout = setTimeout(() => {
      setCurrentBarIndex(0);
    }, 500);

    return () => {
      clearTimeout(startTimeout);
      cancel();
    };
  }, [chartData, cancel]);

  // Handle progression through bars based on currentBarIndex
  useEffect(() => {
    if (!chartData || currentBarIndex < 0) return;

    // Check if animation is complete
    if (currentBarIndex >= chartData.length) {
      setCurrentBarIndex(-1);
      setIsNarrating(false);
      onComplete?.();
      return;
    }

    // Add current bar to chart data
    const currentBarData = chartData[currentBarIndex];
    setData((prevData) => {
      const newData = [...prevData];
      newData[currentBarIndex] = currentBarData;
      return newData;
    });

    // Start narration for current bar after a brief delay
    const narrationTimeout = setTimeout(() => {
      speakBarData(currentBarData);
    }, 300);

    return () => clearTimeout(narrationTimeout);
  }, [currentBarIndex, chartData, speakBarData, onComplete]);

  const transformedData = useMemo(
    () =>
      data
        .filter(
          (item) =>
            item && item[xAxisKey] !== undefined && item[yAxisKey] !== undefined
        )
        .map((item, index) => ({
          [xAxisKey]: item[xAxisKey],
          [yAxisKey]: item[yAxisKey],
          isCurrentBar: index === currentBarIndex,
        })),
    [data, xAxisKey, yAxisKey, currentBarIndex]
  );

  return (
    <div className="w-full h-100  rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={transformedData}>
          <XAxis dataKey={xAxisKey} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar dataKey={yAxisKey} fill={barColor}>
            {/* <LabelList
              dataKey={yAxisKey}
              position="top"
              className="fill-current text-sm font-medium"
            /> */}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Custom Tooltip for better dark mode styling
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

export default BarChart;
