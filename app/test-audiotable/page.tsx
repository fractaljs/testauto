"use client";

import React, { useState } from "react";
import AudioTable, { AudioTableProps } from "../components/AudioTable";

export default function TestAudioTable() {
  const [isPlaying, setIsPlaying] = useState(false);

  const sampleTableData = [
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
    {
      pg: "Wallet",
      sr: "67%",
      volume: "500K",
      audio:
        "Digital wallets have a success rate of 67 percent with 500 thousand transactions",
    },
  ];

  const customColumns = [
    { key: "pg", label: "Payment Gateway", width: "w-1/4" },
    { key: "sr", label: "Success Rate", width: "w-1/4" },
    { key: "volume", label: "Transaction Volume", width: "w-1/2" },
  ];

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handleComplete = () => {
    setIsPlaying(false);
    console.log("Audio table animation completed!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Audio-Synced Table Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This table displays rows one by one with audio narration for each
            row.
          </p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleStart}
              disabled={isPlaying}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPlaying ? "Playing..." : "Start Audio Table"}
            </button>

            <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Status: {isPlaying ? "Playing" : "Ready"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <AudioTable
            tableData={sampleTableData}
            columns={customColumns}
            onComplete={handleComplete}
            audioEnabled={true}
            highlightColor="bg-green-500/20 border-green-500"
          />
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Component Features
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>• Progressive row display with smooth animations</li>
            <li>• Audio narration for each row (optional)</li>
            <li>• Visual highlighting of current row</li>
            <li>• Audio status indicator</li>
            <li>• Customizable columns and styling</li>
            <li>• Dark mode support</li>
            <li>• Completion callback</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
