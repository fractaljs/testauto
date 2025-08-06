"use client";

import BarChart from "../components/BarChart";

const testData = [
  {
    month: "January",
    desktop: 186,
    audio: "January shows 186 desktop users, marking the start of our growth",
  },
  {
    month: "February", 
    desktop: 305,
    audio: "February increased to 305 desktop users, a significant jump",
  },
  {
    month: "March",
    desktop: 237,
    audio: "March dipped to 237 desktop users, but remained strong",
  },
];

export default function TestBarChart() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Progressive BarChart with Audio Test</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">With Audio Enabled (Default)</h2>
          <BarChart 
            chartData={testData}
            audioEnabled={true}
            onComplete={() => console.log("Chart animation completed")}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Without Audio</h2>
          <BarChart 
            chartData={testData}
            audioEnabled={false}
          />
        </div>
      </div>
    </div>
  );
}