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
  
  const input = {
    "marks": "[3,5,7,8,9]",
    "id": "['15','10','13','11','19']",
    "status": "success"
  };
  
  
  function convertToDataArray(input: Record<string, string>): Array<Record<string, any>> {
    const keys = Object.keys(input);
    const dataArray: Array<Record<string, any>> = [];
  
    const arrayKeys = keys.filter(key => input[key].startsWith("[") && input[key].endsWith("]"));
    const parsedArrays = arrayKeys.map(key => JSON.parse(input[key].replace(/'/g, '"')));
  
    const maxLength = Math.max(...parsedArrays.map(arr => arr.length));
  
    for (let i = 0; i < maxLength; i++) {
      const obj: Record<string, any> = {};
      arrayKeys.forEach((key, index) => {
        let value = parsedArrays[index][i] !== undefined ? parsedArrays[index][i] : null;
        // Convert values in the second column to numbers
        if (index === 1 && value !== null) {
          value = Number(value);
        }
        obj[key] = value;
      });
      dataArray.push(obj);
    }
  
    return dataArray;
  }
  
  const chartConfig = {
  
  } satisfies ChartConfig

export function GridCircleFilled({ Data }: { Data: object[] }) {

    const data = convertToDataArray(input);
    const keys = Object.keys(data[0]);
  
    const sc = keys[1];
    const fc = keys[0];
  
    data.forEach(item => {
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
            <PolarAngleAxis dataKey={fc} />
            <Radar
              dataKey={sc}
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
