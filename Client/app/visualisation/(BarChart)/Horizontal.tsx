"use client";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { convertToDataArray, getGrayCode } from "@/lib/utils";

function generateChartConfig(data: Array<Record<string, string>>): ChartConfig {
  if (data.length === 0) return {};

  const keys = Object.keys(data[0]);
  const chartConfig: ChartConfig = {};

  keys.forEach((key) => {
    chartConfig[key] = { label: key.charAt(0).toUpperCase() + key.slice(1) };
  });

  return chartConfig;
}

export function Horizontal({ data }: { data: Array<Record<string, any>> }) {
  if (!data) {
    return <div>No data available</div>;
  }
  const dataArray = convertToDataArray(data);
  const chartConfig = generateChartConfig(dataArray);
  const keys = Object.keys(dataArray[0]);
  const fc = keys[0];
  const sc = keys[1];
  const shades = getGrayCode(dataArray.length);
  data.forEach((item: any, index: number) => {
    item.fill = shades[index % shades.length];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Horizontal</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis type="number" dataKey={sc} hide />
            <YAxis
              dataKey={fc}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.toString().slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey={sc} radius={5}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
