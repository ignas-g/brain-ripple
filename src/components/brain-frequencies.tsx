import React from "react";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  Legend,
} from "@devexpress/dx-react-chart-material-ui";
import { Stack, Animation } from "@devexpress/dx-react-chart";
import { random } from "../utils/random"; // Update the import path

// Add type definition for the data prop
type DataType = {
  type: string;
  frequency: number;
};

type BrainwaveFrequencyChartProps = {
  data: DataType[];
};

const BrainwaveFrequencyChart: React.FC<BrainwaveFrequencyChartProps> = ({ data }) => {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Chart data={data}>
        <ArgumentAxis />
        <ValueAxis />

        <BarSeries
          valueField="frequency"
          argumentField="type"
          name="Frequency"
        />

        <Legend position="bottom" />
        <Stack />
        <Animation />
      </Chart>
    </div>
  );
};

export default BrainwaveFrequencyChart;
