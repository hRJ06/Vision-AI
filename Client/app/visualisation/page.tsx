"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Dots } from "./(LineChart)/Dots";
import { Linear } from "./(LineChart)/Linear";
import { Normal } from "./(LineChart)/Normal";
import { Step } from "./(LineChart)/Step";
import { CustomDots } from "./(LineChart)/CustomDots";
import { LabelLine } from "./(LineChart)/LabelLine";
import axios from "axios";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Donut } from "./(PieChart)/Donut";
import { DonutText } from "./(PieChart)/DonutText";
import { DonutActive } from "./(PieChart)/DonutActive";
import { LabelPie } from "./(PieChart)/LabelPie";
import { Labellist } from "./(PieChart)/LabelList";
import { DotsColor } from "./(LineChart)/DotsColor";
import { NormalBar } from "./(BarChart)/NormalBar";
import { LabelBar } from "./(BarChart)/LabelBar";
import { CustomLabel } from "./(BarChart)/CustomLabel";
import { Mixed } from "./(BarChart)/Mixed";
import { Active } from "./(BarChart)/Active";
import { Negative } from "./(BarChart)/Negative";
import { Horizontal } from "./(BarChart)/Horizontal";
import { DotsArea } from "./(AreaChart)/DotsArea";
import { GridFilled } from "./(AreaChart)/GridFilled";
import { GridCircle } from "./(AreaChart)/GridCircle";
import { GridCircleFilled } from "./(AreaChart)/GridCircleFilled";
import Cookies from "js-cookie";
import Link from "next/link";
import {
  DISABLED_TYPE_SET,
  downloadSVGDiagram,
  generate_JSON_prompt,
  getModel,
} from "@/lib/utils";

export default function Component() {
  const { toast } = useToast();
  const model = getModel();
  const [selectedChart, setSelectedChart] = useState("");
  const [linearType, setLinearType] = useState("");
  const [barType, setBarType] = useState("");
  const [areaType, setAreaType] = useState("");
  const [pieType, setPieType] = useState("");
  const [isClicked, setIsClicked] = useState(true);
  const [databaseSchema, setDatabaseSchema] = useState("");
  const [schema, setSchema] = useState(null);
  const [selectedTable, setSelectedTable] = useState("");
  const [firstColumn, setFirstColumn] = useState("");
  const [secondColumn, setSecondColumn] = useState("");
  const [host, setHost] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [port, setPort] = useState("");
  const [database, setDatabase] = useState("");
  const [options, setOptions] = useState("0");
  const [data, setData] = useState<Record<string, string>>();

  /* HANDLER FOR TABLE CHANGE */
  const handleTableChange = (value: any) => {
    setSelectedTable(value);
    setFirstColumn("");
    setSecondColumn("");
  };

  /* HANDLER FOR JSON FORMAT */
  const formatHandler = async (response: any) => {
    const prompt = generate_JSON_prompt(response as string);
    const result = await model.generateContent(prompt);
    return result.response.text();
  };

  /* GET DB SCHEMA HANDLER */
  const connectToDB = async () => {
    const data = {
      User: user,
      Password: password,
      Host: host,
      Port: port,
      Database: database,
    };

    try {
      let response = await axios.post(
        "http://127.0.0.1:5000/fetch-table",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.status) {
        Cookies.set("db", response?.data?.db);
        let value = await formatHandler(response?.data?.tables_info);
        value = value.slice(7, -3);
        setDatabaseSchema(value);
        const finalSchema = JSON.parse(databaseSchema);
        setSchema(finalSchema);
        toast({
          variant: "success",
          title: "Connection Successful",
          description: "The connection was successful.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Please Try Again",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please Try Again",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  /* UTIL FUNCTION TO FILTER DATA */
  const convertAndFilterData = (data: any) => {
    return data
      .map((item: any) => (item != "None" ? item : 0))
      .filter((item: any) => item != "None");
  };

  /* HANDLER FUNCTION TO GENERATE CHART */
  const generateChart = async () => {
    const data = {
      table: selectedTable,
      first_column: firstColumn,
      second_column: secondColumn,
      Type: selectedChart,
      Option: options,
    };

    if (!data.table || !data.first_column || !data.second_column) {
      toast({
        title: "Generation Failed",
        variant: "destructive",
        description:
          "Please provide table and column values to generate the Charts.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    try {
      let response = await axios.post(
        "http://127.0.0.1:5000/fetch-table-data",
        { ...data, db: Cookies.get("db") },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const firstData = JSON.parse(response.data[`${firstColumn}`]);
      const secondData = JSON.parse(response.data[`${secondColumn}`]);

      const convertedFirstData = convertAndFilterData(firstData);
      const convertedSecondData = convertAndFilterData(secondData);

      const minLength = Math.min(
        convertedFirstData.length,
        convertedSecondData.length
      );
      const formattedData = Array.from({ length: minLength }, (_, index) => ({
        [firstColumn]: convertedFirstData[index],
        [secondColumn]: convertedSecondData[index],
      }));

      setData(formattedData as any);
      setIsClicked(false);
      if (response.data.status != "success") {
        toast({
          title: "Uh oh! Something went wrong.",
          variant: "destructive",
          description: "Please Try Again",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "Please Try Again",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  /* HANDLER FUNCTION TO GET CHART CONTENT */
  const renderChartContent = () => {
    switch (selectedChart) {
      case "Line":
        switch (linearType) {
          case "Normal":
            return <Normal data={data as Record<string, string>} />;
          case "Step":
            return <Step data={data as Record<string, string>} />;
          case "Linear":
            return <Linear data={data as Record<string, string>} />;
          case "Dots":
            return <Dots data={data as Record<string, string>} />;
          case "DotsColor":
            return <DotsColor data={data as Record<string, string>} />;
          case "Label":
            return <LabelLine data={data as Record<string, string>} />;
          case "CustomDots":
            return <CustomDots data={data as Record<string, string>} />;
          default:
            return null;
        }

      case "Pie":
        switch (pieType) {
          case "Donut":
            return <Donut data={data as Record<string, string>} />;
          case "DonutText":
            return <DonutText data={data as Record<string, string>} />;
          case "DonutActive":
            return <DonutActive data={data as Record<string, string>} />;
          case "Label":
            return <LabelPie data={data as Record<string, string>} />;
          case "LabelList":
            return <Labellist data={data as Record<string, string>} />;
          default:
            return null;
        }

      case "Bar":
        switch (barType) {
          case "NormalBar":
            return <NormalBar data={data as Record<string, string>} />;
          case "LabelBar":
            return <LabelBar data={data as Record<string, string>} />;
          case "CustomLabel":
            return <CustomLabel data={data as Record<string, string>} />;
          case "Mixed":
            return <Mixed data={data as Record<string, string>} />;
          case "Active":
            return <Active data={data as Record<string, string>} />;
          case "Negative":
            return <Negative data={data as Record<string, string>} />;
          case "Horizontal":
            return <Horizontal data={data as Record<string, string>} />;
          default:
            return null;
        }

      case "Area":
        switch (areaType) {
          case "Dots":
            return <DotsArea data={data as Record<string, string>} />;
          case "GridFilled":
            return <GridFilled data={data as Record<string, string>} />;
          case "GridCircle":
            return <GridCircle data={data as Record<string, string>} />;
          case "GridCircleFilled":
            return <GridCircleFilled data={data as Record<string, string>} />;
          default:
            return null;
        }

      default:
        return null;
    }
  };

  /* HANDLER FUNCTION TO GET DROP DOWN MENU ITEMS */
  const renderDropdownMenuItems = () => {
    switch (selectedChart) {
      case "Line":
        return (
          <>
            <DropdownMenuRadioItem
              value="Normal"
              onClick={() => setLinearType("Normal")}
            >
              Normal
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="Step"
              onClick={() => setLinearType("Step")}
            >
              Step
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="Linear"
              onClick={() => setLinearType("Linear")}
            >
              Linear
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="Dots"
              onClick={() => setLinearType("Dots")}
            >
              Dots
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="DotsColor"
              onClick={() => setLinearType("DotsColor")}
            >
              DotsColor
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="Label"
              onClick={() => setLinearType("Label")}
            >
              Label
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="CustomDots"
              onClick={() => setLinearType("CustomDots")}
            >
              CustomDots
            </DropdownMenuRadioItem>
          </>
        );

      case "Bar":
        return (
          <>
            <DropdownMenuRadioItem
              onClick={() => setBarType("NormalBar")}
              value="NormalBar"
            >
              NormalBar
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onClick={() => setBarType("Negative")}
              value="Negative"
            >
              Negative
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onClick={() => setBarType("Mixed")}
              value="Mixed"
            >
              Mixed
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onClick={() => setBarType("LabelBar")}
              value="LabelBar"
            >
              LabelBar
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onClick={() => setBarType("Horizontal")}
              value="Horizontal"
            >
              Horizontal
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onClick={() => setBarType("CustomLabel")}
              value="CustomLabel"
            >
              CustomLabel
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onClick={() => setBarType("Active")}
              value="Active"
            >
              Active
            </DropdownMenuRadioItem>
          </>
        );

      case "Area":
        return (
          <>
            <DropdownMenuRadioItem
              onClick={() => setAreaType("Dots")}
              value="Dots"
            >
              Dots
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onClick={() => setAreaType("GridFilled")}
              value="GridFilled"
            >
              GridFilled
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onClick={() => setAreaType("GridCircle")}
              value="GridCircle"
            >
              GridCircle
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onClick={() => setAreaType("GridCircleFilled")}
              value="GridCircleFilled"
            >
              GridCircleFilled
            </DropdownMenuRadioItem>
          </>
        );

      case "Pie":
        return (
          <>
            <DropdownMenuRadioItem
              onClick={() => setPieType("Donut")}
              value="Donut"
            >
              Donut
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onClick={() => setPieType("DonutText")}
              value="DonutText"
            >
              DonutText
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onClick={() => setPieType("DonutActive")}
              value="DonutActive"
            >
              DonutActive
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onClick={() => setPieType("Label")}
              value="Label"
            >
              Label
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onClick={() => setPieType("LabelList")}
              value="LabelList"
            >
              LabelList
            </DropdownMenuRadioItem>
          </>
        );

      default:
        return null;
    }
  };
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[300px_1fr_300px] grid-cols-1">
      <div className="flex flex-col border-r bg-background p-4 w-full md:w-[320px] lg:w-[280px]">
        <div className="mx-auto mb-4 lg:mx-0">
          <Link href="/" prefetch={false}>
            <h1 className="text-xl lg:text-left text-center font-semibold">
              Vision AI{" "}
            </h1>
          </Link>
        </div>
        <h3 className="text-sm font-medium  text-muted-foreground ml-2">
          Database Credentials
        </h3>

        <div className="grid gap-2 space-y-3 mt-2 p-1">
          <div className="grid gap-1">
            <Input
              id="host"
              placeholder="localhost"
              onChange={(e) => setHost(e.target.value)}
              value={host}
            />
          </div>
          <div className="grid gap-1">
            <Input
              id="port"
              placeholder="port"
              onChange={(e) => setPort(e.target.value)}
              value={port}
            />
          </div>
          <div className="grid gap-1">
            <Input
              id="username"
              placeholder="username"
              onChange={(e) => setUser(e.target.value)}
              value={user}
            />
          </div>
          <div className="grid gap-1">
            <Input
              id="database"
              placeholder="database"
              onChange={(e) => setDatabase(e.target.value)}
              value={database}
            />
          </div>
          <div className="grid gap-1">
            <Input
              id="password"
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className="grid gap-1">
            <Button
              className="mt-4 w-full py-2 px-4 rounded border-none"
              onClick={() => connectToDB()}
            >
              Connect
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-muted/40 p-4 flex-grow">
        <div className="mt-8 w-full max-w-[800px] chart">
          <div className="space-y-2 w-full aspect-[6/3] flex items-center justify-center">
            {isClicked ? (
              <div className="space-y-2  text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  Welcome to Vision AI
                </h1>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">
                  Pioneering the Future of Intelligent Solutions
                </h2>
                <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
                  Start a conversation by connecting to a chat server.
                </p>
              </div>
            ) : (
              <>
                <div className="w-full aspect-w-6 aspect-h-3">
                  {renderChartContent()}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col border-l bg-background p-4 flex-none  w-full md:w-[320px] lg:w-[280px]">
        <div className="mt-4 font-semibold text-xl">Export</div>
        <div className="grid gap-2">
          <Button
            variant="outline"
            size="sm"
            className="justify-start bg-black mt-4 text-white"
            onClick={() => downloadSVGDiagram("chart", "Chart")}
            disabled={isClicked}
          >
            <FileIcon className="h-4 w-4 mr-2" />
            SVG
          </Button>
        </div>

        <div className="mt-4">
          <div className="font-semibold text-xl">Table</div>
          <div className="mt-2">
            <DropdownMenu>
              <DropdownMenuContent align="end">
                {schema &&
                  Object.keys(schema).map((table) => (
                    <DropdownMenuItem
                      key={table}
                      onSelect={() => handleTableChange(table)}
                    >
                      {table}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-2">
            <Select onValueChange={handleTableChange}>
              <SelectTrigger className="lg:w-[250px] w-full bg-black text-white">
                <SelectValue placeholder="Select Table" value={selectedTable} />
              </SelectTrigger>
              <SelectContent>
                {schema &&
                  Object.keys(schema).map((table) => (
                    <SelectItem key={table} value={table}>
                      {table}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="font-semibold text-xl mt-4">Column</div>
          <div className="mt-2">
            <Select onValueChange={setFirstColumn}>
              <SelectTrigger className="lg:w-[250px] w-full bg-black text-white">
                <SelectValue placeholder="Select Column" value={firstColumn} />
              </SelectTrigger>
              <SelectContent>
                {selectedTable &&
                  schema &&
                  schema[selectedTable] &&
                  Object.keys(schema[selectedTable]).map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2">
            <Select onValueChange={setSecondColumn}>
              <SelectTrigger className="lg:w-[250px] w-full bg-black text-white">
                <SelectValue placeholder="Select Column" value={secondColumn} />
              </SelectTrigger>
              <SelectContent>
                {selectedTable &&
                  schema &&
                  schema[selectedTable] &&
                  Object.keys(schema[selectedTable]).map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <div className="font-semibold text-xl">Chart</div>

          <div className="flex gap-x-3 justify-center w-full">
            <div className="mt-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black text-white hover:bg-gray-900 hover:text-white"
                  >
                    <BarChartIcon className="h-4 w-4" />
                    {!selectedChart.length ? "Charts" : selectedChart}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup value={selectedChart}>
                    <DropdownMenuRadioItem
                      value="bar"
                      onClick={() => setSelectedChart("Bar")}
                    >
                      Bar
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="line"
                      onClick={() => setSelectedChart("Line")}
                    >
                      Line
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="area"
                      onClick={() => setSelectedChart("Area")}
                    >
                      Area
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="pie"
                      onClick={() => setSelectedChart("Pie")}
                    >
                      Pie
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black text-white hover:bg-gray-900 hover:text-white"
                  >
                    <BarChartIcon className="h-4 w-4" />
                    {!linearType.length ? "Types" : linearType}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup>
                    {renderDropdownMenuItems()}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-2 w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black text-white hover:bg-gray-900 hover:text-white w-full"
                    disabled={DISABLED_TYPE_SET.has(selectedChart)}
                  >
                    {options != "0" ? "Count" : "Sum"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup
                    value={options}
                    onValueChange={setOptions}
                  >
                    <DropdownMenuRadioItem value="0">Sum</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="1">
                      Count
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-2 text-center">
            <Button
              className="dark:bg-white bg-black text-white dark:text-black  w-full mt-3"
              onClick={() => generateChart()}
            >
              Generate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BarChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
