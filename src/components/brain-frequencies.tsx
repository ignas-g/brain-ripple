import React from "react";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  Legend,
} from "@devexpress/dx-react-chart-material-ui";
import { Stack, Animation } from "@devexpress/dx-react-chart";
import {random} from "@/utils/random";

const BrainwaveFrequencyChart = ({data}:{data:any}) => {
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
