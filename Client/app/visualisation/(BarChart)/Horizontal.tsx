"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"

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
  const step = Math.floor(255 / count);
  const shades = [];
  for (let i = 0; i < count; i++) {
    const grayValue = step * i;
    shades.push(`rgb(${grayValue}, ${grayValue}, ${grayValue})`);
  }
  return shades;
}

const input = {
  "marks": "[3,5]",
  "id": "['15','10']",
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

function generateChartConfig(input: Record<string, string>): ChartConfig {
  const keys = Object.keys(input);
  const arrayKeys = keys.filter(key => input[key].startsWith("[") && input[key].endsWith("]"));
  const chartConfig: ChartConfig = {};

  arrayKeys.forEach(key => {
    chartConfig[key] = { label: key.charAt(0).toUpperCase() + key.slice(1) };
  });

  return chartConfig;
}

const chartConfig = generateChartConfig(input);

export function Horizontal({ Data }: { Data: object[] }) {
  const data = convertToDataArray(input);
  const keys = Object.keys(data[0]);

  const sc = keys[1];
  const fc = keys[0];

  const shades = getDistinctGrayShades(data.length);

  data.forEach((item: any, index: number) => {
    item.fill = shades[index % shades.length];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Horizontal</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
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
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
