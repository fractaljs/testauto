"use client";

import React, { useState, useEffect, useMemo } from "react";
import { textToSpeech } from "@/lib/tts";
import BarChart, { BarChartProps } from "./components/BarChart";
import AudioTable from "./components/AudioTable";
import { AnimatePresence, motion } from "motion/react";
import { getQuestion, getAnswer } from "./textStates.utils";
import LineChart from "./components/LineChart";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const [currentState, setCurrentState] = useState<number>(0);
  const [askingQuestion, setAskingQuestion] = useState<boolean>(false);

  const startDemo = async () => {
    await delay(100);
    textToSpeech("What is the SR conversion for this week?");
    await delay(4000);
    setCurrentState(1);
    await delay(3000);
    setCurrentState(2);
    await delay(10000);
    textToSpeech("Why is the SR conversion for this week 54%?");
    await delay(6000);
    setCurrentState(3);
    await delay(1000);
    textToSpeech("Ah!, I can see that UPI SR is less than last month");
    await delay(5000);
    setCurrentState(4);
    textToSpeech("Why?");
    setCurrentState(5);
    await delay(3000);
    textToSpeech("Let me check that across PGs");
    setCurrentState(6);
    await delay(3000);
    setCurrentState(7);
    await delay(1000);
    setCurrentState(8);
    await delay(9000);
    textToSpeech(
      "Let me check the reason for the drop, I will check our logs and emails to check if there were any outages"
    );
    await delay(5000);
    setCurrentState(9);
    await delay(10000);
    setCurrentState(10);
    // await delay(5000);
    // setCurrentState(5);
    // await delay(1000);
  };

  const goToPreviousState = () => {
    setCurrentState((prev) => Math.max(0, prev - 1));
  };

  const goToNextState = () => {
    setCurrentState((prev) => Math.min(9, prev + 1)); // Updated max state to 3
  };

  return (
    <div className="font-sans h-screen p-8">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-4 items-center">
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={goToPreviousState}
          disabled={currentState === 0}
        >
          ← Previous
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          onClick={startDemo}
        >
          Start Demo
        </button>
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={goToNextState}
          disabled={currentState === 9}
        >
          Next →
        </button>
        <div className="ml-4 px-3 py-2 bg-gray-800 text-white rounded text-sm">
          State: {currentState}
        </div>
      </div>
      <main className="flex gap-4 w-full h-full">
        <LeftPannel currentState={currentState} />
        <RightPannel currentState={currentState} />
      </main>
    </div>
  );
}

const RightPannel = ({ currentState }: { currentState: number }) => {
  const renderContent = () => {
    if (currentState >= 2) {
      return <SRUIElemets currentState={currentState} />;
    }
    return null;
  };
  return (
    <div className="w-2/3 h-full flex items-center justify-center ">
      {renderContent()}
    </div>
  );
};

const SRUIElemets = ({ currentState }: { currentState: number }) => {
  const actualData = {
    data: [
      {
        month: "January",
        SR: 54,
        audio: "The SR for the month of January is 54%",
      },
      {
        month: "February",
        SR: 73,
        audio: "which is 19% less than the last month",
      },
    ],
  };

  const lineChartData = [
    {
      month: "Week 1",
      uptime: 98.5,
      audio: "In week 1, HDFC uptime was 98.5%",
    },
    {
      month: "Week 2",
      uptime: 99.2,
      audio: "In week 2, uptime improved to 99.2%",
    },
    {
      month: "Week 3",
      uptime: 97.8,
      audio: "In week 3, there was a drop to 97.8%",
    },
    {
      month: "Week 4",
      uptime: 96.5,
      audio: "In week 4, uptime dropped further to 96.5%",
    },
  ];

  const tableData = [
    {
      pg: "UPI",
      sr: "45%",
      volume: "1.2M",
      audio:
        "UPI has a success rate of 45 percent with a volume of 1.2 million transactions",
    },
    {
      pg: "Card",
      sr: "78%",
      volume: "800K",
      audio:
        "Card payments show a success rate of 78 percent with 800 thousand transactions",
    },
    {
      pg: "Net Banking",
      sr: "92%",
      volume: "300K",
      audio:
        "Net Banking has the highest success rate at 92 percent with 300 thousand transactions",
    },
  ];

  const tableColumns = [
    { key: "pg", label: "Payment Gateway", width: "w-1/3" },
    { key: "sr", label: "Success Rate", width: "w-1/3" },
    { key: "volume", label: "Volume", width: "w-1/3" },
  ];

  console.log(
    "SRUIElemets render - currentState:",
    currentState,
    "data:",
    actualData.data
  );

  // Memoize the chart to prevent re-rendering when only currentState changes
  const chartComponent = React.useMemo(() => {
    return (
      <BarChart
        chartData={actualData.data}
        xAxisKey="month"
        yAxisKey="SR"
        barColor="#4ade80"
      />
    );
  }, []); // Empty dependency array means it only renders once

  // Memoize the table component
  const tableComponent = React.useMemo(() => {
    return (
      <AudioTable
        // tableData={tableData}
        // columns={tableColumns}
        audioEnabled={true}
        highlightColor="bg-blue-500/20 border-blue-500"
      />
    );
  }, []);

  const lineChartComponent = React.useMemo(() => {
    return (
      <LineChart
        chartData={lineChartData}
        xAxisKey="month"
        yAxisKey="uptime"
        lineColor="#ef4444"
        audioEnabled={true}
      />
    );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-7">
      {/* <AnimatePresence initial={false}> */}
      {currentState >= 2 && currentState <= 7 && (
        <motion.div key="chart" className="w-100 h-96">
          {chartComponent}
        </motion.div>
      )}
      {currentState >= 4 && currentState <= 7 && (
        <div className="w-full text-center">
          <p className="text-white text-lg">UPI SR is less than last month</p>
        </div>
      )}
      {/* </AnimatePresence> */}
      {currentState >= 8 && currentState <= 9 && (
        <div className="w-full max-w-2xl">
          <h3 className="text-white text-lg mb-4 text-center">
            Payment Gateway Analysis
          </h3>
          {tableComponent}
        </div>
      )}
      {currentState === 10 && (
        <div className="w-full max-w-4xl">
          <h3 className="text-white text-lg mb-4 text-center">
            HDFC Reliability/Uptime Analysis - Last Month
          </h3>
          <div className="w-full h-96">{lineChartComponent}</div>
        </div>
      )}
    </div>
  );
};

const LeftPannel = ({ currentState }: { currentState: number }) => {
  const [question, setQuestion] = useState<string>(getQuestion(currentState));
  const [answer, setAnswer] = useState<string>(getAnswer(currentState));

  useEffect(() => {
    setQuestion(getQuestion(currentState));
    setAnswer(getAnswer(currentState));
  }, [currentState]);

  return (
    <div className="w-1/3 h-full flex flex-col justify-center">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.h1
          key={question}
          className="text-[rgba(255, 255, 255, 0.4)] text-[24px] font-medium pb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {question}
        </motion.h1>
      </AnimatePresence>
      <div
        className="text-[rgba(255, 255, 255, 0.4)] text-[16px] font-medium pb-8"
        dangerouslySetInnerHTML={{
          __html: answer,
        }}
      ></div>
    </div>
  );
};
