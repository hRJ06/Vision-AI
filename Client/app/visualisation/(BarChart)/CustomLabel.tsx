"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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

const chartConfig = {

} satisfies ChartConfig



export function CustomLabel({ Data }: { Data: Array<Record<string, any>> }) {

  if (Data === undefined) {
    return <div>No data available</div>;
  }
  const data = convertToDataArray(Data);

  // console.log("Config", chartConfig);
  const keys = Object.keys(data[0]);
  const fc = keys[0];
  const sc = keys[1];

  const shades = getDistinctGrayShades(data.length);

  data.forEach((item: any, index: number) => {
    item.fill = shades[index % shades.length];
  });



  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Custom Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey={fc}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.toString().slice(0, 3)}
              hide
            />
            <XAxis dataKey={sc} type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey={sc}
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
            >
              <LabelList
                dataKey={fc}
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey={sc}
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
