"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { textToSpeech } from "../../lib/tts";
import { motion } from "motion/react";

export type TableRow = {
  [key: string]: string | number;
  audio?: string;
};

export type AudioTableProps = {
  tableData?: TableRow[];
  onComplete?: () => void;
  columns?: { key: string; label: string; width?: string }[];
  audioEnabled?: boolean;
  highlightColor?: string;
};

const defaultTableData: TableRow[] = [
  {
    pg: "Razorpay",
    sr: "45%",
    change: "-5%",
    volume: "1.2M",
    audio: "Razorpay SR intent went down by 5 percent",
  },
  {
    pg: "PayU",
    sr: "78%",
    change: "-15%",
    volume: "800K",
    audio: "while PayU SR went down by 15 percent",
  },
];

const defaultColumns = [
  { key: "pg", label: "Payment Gateway", width: "w-1/3" },
  { key: "sr", label: "Success Rate", width: "w-1/3" },
  { key: "change", label: "Change", width: "w-1/3" },
  //   { key: "volume", label: "Volume", width: "w-1/3" },
];

const AudioTable = ({
  tableData = defaultTableData,
  onComplete,
  columns = defaultColumns,
  audioEnabled = true,
  highlightColor = "bg-green-500/20 border-green-500",
}: AudioTableProps) => {
  const [visibleRows, setVisibleRows] = useState<TableRow[]>([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(-1);
  const [isNarrating, setIsNarrating] = useState(false);

  const handleNarrationComplete = useCallback(() => {
    setIsNarrating(false);
    // Move to next row after audio completes
    setCurrentRowIndex((prev) => prev + 1);
  }, []);

  const speakRowData = useCallback(
    async (rowData: TableRow) => {
      if (!audioEnabled || !rowData.audio) {
        // If audio is disabled, move to next row after a short delay
        setTimeout(() => setCurrentRowIndex((prev) => prev + 1), 800);
        return;
      }

      setIsNarrating(true);
      try {
        await textToSpeech(rowData.audio as string, handleNarrationComplete);
      } catch (error) {
        console.error("Text-to-speech error:", error);
        // If TTS fails, still move to next row
        handleNarrationComplete();
      }
    },
    [audioEnabled, handleNarrationComplete]
  );

  // Initialize table data and start animation
  useEffect(() => {
    if (!tableData || tableData.length === 0) return;

    setVisibleRows([]);
    setCurrentRowIndex(-1);
    setIsNarrating(false);

    // Start with first row after a short delay
    const startTimeout = setTimeout(() => {
      setCurrentRowIndex(0);
    }, 500);

    return () => {
      clearTimeout(startTimeout);
    };
  }, [tableData]);

  // Handle progression through rows based on currentRowIndex
  useEffect(() => {
    if (!tableData || currentRowIndex < 0) return;

    // Check if animation is complete
    if (currentRowIndex >= tableData.length) {
      setCurrentRowIndex(-1);
      setIsNarrating(false);
      onComplete?.();
      return;
    }

    // Add current row to visible rows
    const currentRowData = tableData[currentRowIndex];
    setVisibleRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[currentRowIndex] = currentRowData;
      return newRows;
    });

    // Start narration for current row after a brief delay
    const narrationTimeout = setTimeout(() => {
      speakRowData(currentRowData);
    }, 300);

    return () => clearTimeout(narrationTimeout);
  }, [currentRowIndex, tableData, speakRowData, onComplete]);

  return (
    <div className="w-full rounded-lg  overflow-hidden">
      <table className="w-full">
        <thead className="">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                  column.width || ""
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {visibleRows.map((row, index) => (
            <motion.tr
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              key={index}
              className={`transition-all duration-500`}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${
                    column.width || ""
                  }`}
                >
                  {row[column.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AudioTable;
