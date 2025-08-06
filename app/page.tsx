"use client";

import { useState } from "react";
import { textToSpeech } from "@/lib/tts";
import BarChart from "./components/BarChart";

export default function Home() {
  const [start, setStart] = useState(false);

  const test = () => {
    textToSpeech("Hello, how are you?", () => {
      textToSpeech("I am fine", () => {
        textToSpeech("Thank you", () => {
          textToSpeech("You are welcome", () => {
            textToSpeech("Goodbye", () => {});
          });
        });
      });
    });
  };

  const actualData = {
    data: [
      {
        month: "January",
        SR: 54,
        audio: "for January we have 54 SR",
      },
      {
        month: "February",
        SR: 73,
        audio: "which is 19% less than the last month",
      },
    ],
  };

  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="max-w-2xl mx-auto">
        <button onClick={test}>Start</button>
        <button onClick={() => setStart(true)}>Start</button>
        {start && (
          <BarChart
            chartData={actualData.data}
            xAxisKey="month"
            yAxisKey="SR"
          />
        )}
      </main>
    </div>
  );
}
