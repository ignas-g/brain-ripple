import React from "react";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  LineSeries,
  Legend,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation } from "@devexpress/dx-react-chart";
import {random} from "@/utils/random";

const BrainwaveChart = ({data}: {data:any}) => {
  const seriesNames = Array.from({ length: data.length }, (_, index) => `Channel ${index + 1}`);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Chart data={data}>
        <ArgumentAxis />
        <ValueAxis />

        {seriesNames.map((seriesName, index) => (
          <LineSeries
            key={index}
            valueField="value"
            argumentField="time"
            seriesComponent={LineSeries.Path}
            name={seriesName}
          />
        ))}

        <Legend position="bottom" />
        <Animation />
      </Chart>
    </div>
  );
};

export default BrainwaveChart;
