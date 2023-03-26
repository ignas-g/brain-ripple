import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type DataType = {
  time: number;
  value: number;
  series: string;
};

type BrainwaveChartProps = {
  data: DataType[];
};

// index to colour function
 const indexToColour = (index: number) => {
  const colours = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#000000",
    "#ffffff",
    "#ff7f00",
    "#7f00ff",
    "#00ff7f",
    "#7f7f00",
    "#7f007f",
    "#007f7f",
    "#7f7f7f",
    "#ff7f7f",
    "#7fff7f",
    "#7f7fff",
    "#ffff7f",
    "#ff7fff",
    "#7fffff",
    "#000000",
    "#ffffff",
  ];
  return colours[index];
 }


const BrainwaveChart: React.FC<BrainwaveChartProps> = ({ data }) => {
  const seriesNames = Array.from(new Set(data.map((d) => d.series)));

  const dataByKeys:any[] = [];
  // populate as an array of objects with time as property of the object
  data.forEach((d) => {
    const time = d.time;
    const value = d.value;
    const series = d.series;
    if (!dataByKeys[time]) {
      dataByKeys[time] = { time };
    }
    dataByKeys[time][series] = value;
  });

  const series = seriesNames.map((seriesName, index) => {
    return (
      <Line
        key={index}
        type="monotone"
        dataKey={seriesName}
        name={seriesName}
        stroke={indexToColour(index)}
        strokeWidth={2}
        isAnimationActive={false}
        dot={false}
      />
    );
  });


  return (
    <div style={{ width: "100%", height: "400px" }}>
        <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }} data={dataByKeys} width={500} height={300}>
          <XAxis dataKey="time" />
          <YAxis />
          {series}
        </LineChart>
    </div>
  );
};

export default BrainwaveChart;
