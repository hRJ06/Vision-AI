"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { generateLineChartData } from "@/lib/utils";
const chartConfig = {
  desktop: {
    label: "ssfsf",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Step({ data }: { data: Record<string, string> }) {
  const dataArray = Array.isArray(data) ? data : [];
  if (dataArray.length > 0) {
    const keys = Object.keys(dataArray[0]);
    if (keys.length > 1) {
      chartConfig.desktop.label = keys[1];
    }
  }
  const chartData = generateLineChartData(dataArray);
  return (
    <Card className="bg-gray-900 text-white">
      <CardHeader>
        <CardTitle>Line Chart - Step</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toString().slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="step"
              stroke="#7987A1"
              strokeWidth={4}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
