"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

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



export function Donut({ Data }: { Data: object[] }) {
  console.log("Data", Data);
  // const data = [
  //   { marks: 10, user: 2 },
  //   { marks: 12, user: 1 },
  //   { marks: 17, user: 5 },
  //   { marks: 10, user: 6 },
  //   { marks: 13, user: 8 },
  // ];

  const data = Data || [];
  
  const generateChartConfig = (data) => {
    // Collect unique keys excluding 'visitors'
    const uniqueKeys = data.reduce((acc, item) => {
      Object.keys(item).forEach(key => {
        if (key !== 'visitors' && !acc.includes(key)) {
          acc.push(key);
        }
      });
      return acc;
    }, []);
    
    // Generate a color for each unique key
    const getColor = (index) => `hsl(var(--chart-${index + 1}))`;
  
    // Build chartConfig with colors and labels
    const chartConfig = uniqueKeys.reduce((config, key, index) => {
      config[key] = {
        label: capitalizeFirstLetter(key),
        color: getColor(index),
      };
      return config;
    }, {});
  
    // Add the fixed 'visitors' entry
    chartConfig.visitors = {
      label: "Visitors",
    };
  
    return chartConfig;
  };
  
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  // Generate chartConfig from the data
  const chartConfig = generateChartConfig(data);
  
  // Map the data and add the fill color based on chartConfig
  const mappedData = data.map((item, index) => {
    const keys = Object.keys(item);
    const key = keys.find(k => k !== 'visitors'); // Find the key that's not 'visitors'
    return {
      [`${key}_${index}`]: item[key], // Concatenate index with key
      visitors: item.visitors,
      fill: chartConfig[key] ? chartConfig[key].color : 'black' // Assign color from chartConfig
    };
  });
  
  // Update chartConfig.visitors.label if 'visitors' key is present in data
  if (data.length > 0) {
    const keys = Object.keys(data[0]);
    if (keys.length > 1) {
      chartConfig.visitors.label = keys[1];
    }
  }
  
  console.log("Config", chartConfig);
  console.log("Mapped Data", mappedData);

  return (
    <Card className="flex flex-col bg-gray-900 text-white">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={mappedData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
            />
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
