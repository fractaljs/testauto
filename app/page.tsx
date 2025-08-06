"use client";

import React, { useState, useEffect, useMemo } from "react";
import { textToSpeech } from "@/lib/tts";
import BarChart, { BarChartProps } from "./components/BarChart";
import { AnimatePresence, motion } from "motion/react";
import { getQuestion, getAnswer } from "./textStates.utils";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const [currentState, setCurrentState] = useState<number>(0);
  const [askingQuestion, setAskingQuestion] = useState<boolean>(false);

  const startDemo = async () => {
    await delay(1000);
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
    await delay(6000);
    setCurrentState(4);
    textToSpeech("Why?");
    // await delay(5000);
    // setCurrentState(5);
    // await delay(1000);
  };

  const goToPreviousState = () => {
    setCurrentState((prev) => Math.max(0, prev - 1));
  };

  const goToNextState = () => {
    setCurrentState((prev) => Math.min(5, prev + 1)); // Updated max state to 3
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
          disabled={currentState === 5}
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

const LeftPannel = ({ currentState }: { currentState: number }) => {
  const [question, setQuestion] = useState<string>(getQuestion(currentState));
  const [answer, setAnswer] = useState<string>(getAnswer(currentState));

  useEffect(() => {
    setQuestion(getQuestion(currentState));
    setAnswer(getAnswer(currentState));
  }, [currentState]);

  return (
    <div className="w-1/3 h-full flex flex-col justify-center">
      <AnimatePresence mode="wait" initial={false}>
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

const RightPannel = ({ currentState }: { currentState: number }) => {
  const renderContent = () => {
    if (currentState >= 2 && currentState <= 4) {
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

  return (
    <div className="flex flex-col items-center justify-center gap-7">
      <div className="w-100 h-96">{chartComponent}</div>
      {currentState >= 4 && (
        <div className="w-full text-center">
          <p className="text-white text-lg">UPI SR is less than last month</p>
        </div>
      )}
    </div>
  );
};
