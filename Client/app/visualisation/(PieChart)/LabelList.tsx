"use client";
import { LabelList, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  convertToDataArray,
  generateChartConfig,
  getGrayCode,
} from "@/lib/utils";

export function Labellist({ data }: { data: Array<Record<string, any>> }) {
  if (!data) {
    return <div>No data available</div>;
  }
  const dataArray = convertToDataArray(data);
  const chartConfig = generateChartConfig(dataArray);
  const keys = Object.keys(dataArray[0]);
  const fc = keys[0];
  const sc = keys[1];
  const shades = getGrayCode(data.length);
  data.forEach((item: any, index: number) => {
    item.fill = shades[index % shades.length];
  });

  return (
    <Card className="flex flex-col bg-gray-900 text-white">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Label List</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] w-full"
        >
          <PieChart width={300} height={300}>
            <ChartTooltip
              content={<ChartTooltipContent nameKey={fc} hideLabel />}
            />
            <Pie data={data} dataKey={fc} nameKey={fc} outerRadius={100}>
              <LabelList
                dataKey={sc}
                position="outside"
                fill="#fff"
                stroke="none"
                fontSize={12}
                formatter={(value: any) =>
                  `${chartConfig[sc]?.label}: ${value}`
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
