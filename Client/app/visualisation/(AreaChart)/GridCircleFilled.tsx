"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

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


function getRandomRgb() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
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


  const chartConfig = {
  
  } satisfies ChartConfig

export function GridCircleFilled({ Data }: { Data: Array<Record<string, any>> }) {

  if (Data === undefined) {
    return <div>No data available</div>;
  }
  const data = convertToDataArray(Data);
  const keys = Object.keys(data[0]);
  const fc = keys[0];
  const sc = keys[1];

  data.forEach((item: any) => {
    item.fill = getRandomRgb();
  });


  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Radar Chart - Grid Circle Filled</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={data}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarGrid
              className="fill-[--color-desktop] opacity-20"
              gridType="circle"
            />
            <PolarAngleAxis dataKey={sc} />
            <Radar
              dataKey={fc}
              fill="var(--color-desktop)"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  )
}
