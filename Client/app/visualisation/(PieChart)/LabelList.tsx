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

function getRandomRgb() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
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


const chartConfig = {

} satisfies ChartConfig


export function Labellist({Data}:{Data:object[]}) {
  const data = convertToDataArray(input)
  const keys = Object.keys(data[0]);

  const sc = keys[1];
  const fc = keys[0];


  data.forEach((item:any)=>{
    item.fill = getRandomRgb();
  })
  return (
    <Card className="flex flex-col bg-gray-900 text-white">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Label List</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey={sc} hideLabel />}
            />
            <Pie data={data} dataKey={fc}>
              <LabelList
                dataKey="browser"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
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
