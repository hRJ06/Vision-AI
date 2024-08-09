"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { convertToDataArray, getGrayCode } from "@/lib/utils";
const chartConfig = {} satisfies ChartConfig;

export function Negative({ data }: { data: Array<Record<string, any>> }) {
  if (!data) {
    return <div>No data available</div>;
  }
  const dataArray = convertToDataArray(data);
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
        <CardTitle>Bar Chart - Negative</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Bar dataKey={sc}>
              <LabelList position="top" dataKey={fc} fillOpacity={1} />
              {data.map((item, index) => (
                <Cell key={index} fill={item.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
