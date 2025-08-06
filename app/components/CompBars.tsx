"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { textToSpeech } from "../../lib/tts";

// Data for the initial bar
const initialBars = [
  {
    id: 1,
    value: 54,
    label: "January",
    color: "bg-white",
    audio: "the SR for January is 54%",
  },
];

// Define the bar type
type BarData = {
  id: number;
  value: number;
  label: string;
  color: string;
  audio: string;
};

// Sequence of bars to be added automatically
const barSequence: BarData[] = [
  {
    id: 1,
    value: 54,
    label: "January",
    color: "bg-white",
    audio: "the SR for January is 54%",
  },
  {
    id: 2,
    value: 73,
    label: "December",
    color: "bg-white",
    audio: "which is 19% less than the last month",
  },
];

export default function ComparativeBarChartPage() {
  const [bars, setBars] = useState<BarData[]>([]); // Start with empty array
  const [currentIndex, setCurrentIndex] = useState(-1); // Start at -1 to indicate no sequence started yet
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isNarrating, setIsNarrating] = useState(false);

  const handleNarrationComplete = useCallback(() => {
    setIsNarrating(false);
    // Move to next bar after audio completes
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const speakBarData = useCallback(
    async (barData: BarData) => {
      if (!barData.audio) {
        // If no audio, move to next bar after a short delay
        setTimeout(() => setCurrentIndex((prev) => prev + 1), 800);
        return;
      }

      setIsNarrating(true);
      try {
        await textToSpeech(barData.audio, handleNarrationComplete);
      } catch (error) {
        console.error("Text-to-speech error:", error);
        // If TTS fails, still move to next bar
        handleNarrationComplete();
      }
    },
    [handleNarrationComplete]
  );

  // Start the sequence by adding the first bar
  useEffect(() => {
    if (bars.length === 0 && isAutoPlaying) {
      const startTimeout = setTimeout(() => {
        setCurrentIndex(0); // Start the sequence
      }, 500); // Start after 500ms

      return () => clearTimeout(startTimeout);
    }
  }, [bars.length, isAutoPlaying]);

  // Auto-animate bars after delay
  useEffect(() => {
    if (
      !isAutoPlaying ||
      currentIndex < 0 ||
      currentIndex >= barSequence.length ||
      isNarrating
    )
      return;

    const timer = setTimeout(() => {
      const nextBar = barSequence[currentIndex];
      setBars((prevBars) => [nextBar, ...prevBars]);

      // Start narration for the new bar after a brief delay
      const narrationTimeout = setTimeout(() => {
        speakBarData(nextBar);
      }, 300);

      return () => clearTimeout(narrationTimeout);
    }, 0); // No delay - add bar immediately

    return () => clearTimeout(timer);
  }, [currentIndex, isAutoPlaying, isNarrating, speakBarData]);

  return (
    <div className="flex flex-col items-center justify-center ">
      {/* Chart Area */}
      <div className="relative flex items-end justify-center w-full h-96 mt-10 bg-muted/30 rounded-xl p-4">
        <AnimatePresence initial={false}>
          {bars.map((bar) => (
            <motion.div
              key={bar.id}
              layout // Animates layout changes (the shift)
              initial={{ opacity: 0, x: -50 }} // Enters from the left
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }} // Exits to the right
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative mx-4 flex flex-col items-center"
              style={{ width: "80px" }}
            >
              <motion.div
                className="w-full text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <span className="text-xl font-bold text-foreground">
                  {bar.value}%
                </span>
              </motion.div>
              <motion.div
                className={`w-full shadow-md bg-white`}
                initial={{ height: 0 }}
                animate={{ height: `${bar.value * 3.2}px` }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  delay: 0.2,
                }}
              />
              <div className="w-full text-center mt-3">
                <span className="text-base font-medium text-muted-foreground">
                  {bar.label}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
