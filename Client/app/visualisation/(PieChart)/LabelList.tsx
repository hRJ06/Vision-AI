"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

function getDistinctGrayShades(count: number): string[] {
  const step = Math.floor(254 / count); 
  const shades = [];
  for (let i = 0; i < count; i++) {
    const grayValue = Math.min(254, step * i); 
    shades.push(`rgb(${grayValue}, ${grayValue}, ${grayValue})`);
  }
  return shades;
}


function convertToDataArray(input: Array<Record<string, any>>): Array<Record<string, any>> {
  return input.map(item => {
    const keys = Object.keys(item);
    const formattedItem: Record<string, any> = {};
    formattedItem[keys[0]] = item[keys[0]];
    formattedItem[keys[1]] = String(item[keys[1]]);
    return formattedItem;
  });
}

function generateChartConfig(data: Array<Record<string, string>>): ChartConfig {
  if (data.length === 0) return {};

  const keys = Object.keys(data[0]);
  const chartConfig: ChartConfig = {};

  keys.forEach(key => {
    chartConfig[key] = { label: key.charAt(0).toUpperCase() + key.slice(1) };
  });

  return chartConfig;
}

export function Labellist({ Data }: { Data: Array<Record<string, any>> }) {
  if (Data === undefined) {
    return <div>No data available</div>;
  }
  const data = convertToDataArray(Data);
  const chartConfig = generateChartConfig(data);
  // console.log("Config", chartConfig);
  const keys = Object.keys(data[0]);
  const fc = keys[0];
  const sc = keys[1];

  const shades = getDistinctGrayShades(data.length);

  data.forEach((item: any, index: number) => {
    item.fill = shades[index % shades.length];
  });

  return (
    <Card className="flex flex-col bg-gray-900 text-white">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Label List</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
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
                formatter={(value: any) => `${chartConfig[sc]?.label}: ${value}`}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
