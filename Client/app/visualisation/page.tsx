"use client"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { Dots } from "./(LineChart)/Dots"
import { Linear } from "./(LineChart)/Linear"
import { Normal } from "./(LineChart)/Normal"
import { Step } from "./(LineChart)/Step"
import { CustomDots } from "./(LineChart)/CustomDots"
import { LabelLine } from "./(LineChart)/LabelLine"
import axios from "axios"
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Donut } from "./(PieChart)/Donut"
import { DonutText } from "./(PieChart)/DonutText"
import { DonutActive } from "./(PieChart)/DonutActive"
import { LabelPie } from "./(PieChart)/LabelPie"
import { Labellist } from "./(PieChart)/LabelList"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { DotsColor } from "./(LineChart)/DotsColor"

export default function Component() {


  const { toast } = useToast();

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const [selectedChart, setSelectedChart] = useState("");
  const [LinearType, setLinearType] = useState("");
  const [BarType, setBarType] = useState("");
  const [AreaType, setAreaType] = useState("");
  const [PieType, setPieType] = useState("");

  const [databaseSchema, setdatabaseSchema] = useState("");
  const [schema, setschema] = useState(null);


  const [selectedTable, setSelectedTable] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedColumn2, setSelectedColumn2] = useState("");

  const [Host, setHost] = useState("");
  const [User, setUser] = useState("");
  const [Password, setPassword] = useState("");
  const [Port, setPort] = useState("");
  const [Database, setDatabase] = useState("");

  // 0 means sum 1 means count
  const [options, setoptions] = useState("0");
  const [Data, setdata] = useState([]);


  const handleTableChange = (value: any) => {
    console.log("Table-->", value);
    setSelectedTable(value);
    setSelectedColumn("");
    setSelectedColumn2("");
  };



  const JSONFORMATTER = async (response: any) => {
    const tableInfo = response?.data?.tables_info;

    const prompt = `I will provide a json message please correct it in the proper format and return me just the final json  output and nothing else, the message is ${tableInfo}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  }



  const connectToDB = async () => {
    const data = {
      User: User,
      Password: Password,
      Host: Host,
      Port: Port,
      Database: Database,
    }

    try {
      let response = await axios.post("http://127.0.0.1:5000/fetch-table", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });


      if (response.data.status === "success") {

        let value = await JSONFORMATTER(response);

        value = value.slice(7, -3);
        console.log("Value", value);
        setdatabaseSchema(value);
        const Finalschema = JSON.parse(databaseSchema);
        setschema(Finalschema)

        console.log("schema2", Finalschema);
        console.log("schema", schema);

        toast({
          variant: "success",
          title: "Connection Successful",
          description: "The connection was successful.",
        });
      } else {
        toast({
          title: "Connection Failed",
          variant: "destructive",
          description:
            response.data.message || "There was an error connecting.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  }


  const Chart = async () => {
    const data = {
      table: selectedTable,
      first_column: selectedColumn,
      second_column: selectedColumn2,
      User: User,
      Password: Password,
      Host: Host,
      Port: Port,
      Database: Database,
      Type: selectedChart,
      Option: options
    };

    // console.log("data", data);
    try {
      let response = await axios.post("http://127.0.0.1:5000/fetch-table-data", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const firstData = JSON.parse(response.data.first_data);
      const secondData = JSON.parse(response.data.second_data);

      const convertAndFilterData = (data: any) => {
        return data.map((item: any) => item === "None" ? 0 : item).filter((item: any) => item !== "None");
      };

      const convertedFirstData = convertAndFilterData(firstData);
      const convertedSecondData = convertAndFilterData(secondData);
      console.log("convertedFirstData", convertedFirstData);
      console.log("convertedSecondData", convertedSecondData);
      console.log("response", response);
      if (response.data.status === "success") {

        const minLength = Math.min(convertedFirstData.length, convertedSecondData.length);
        const formattedData = Array.from({ length: minLength }, (_, index) => ({
          [selectedColumn]: convertedFirstData[index],
          [selectedColumn2]: convertedSecondData[index]
        }));

        // console.log("response2", formattedData);
        const FinalData = formattedData;
        setdata(FinalData);

        toast({
          variant: "success",
          title: "Generated Successful",
          description: "The connection was successful.",
        });
      } else {
        toast({
          title: "Connection Failed",
          variant: "destructive",
          description:
            response.data.message || "There was an error connecting.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  }

  // console.log("first Schema:", schema);
  // console.log("data", Data);

  return (
    <div className="grid min-h-screen w-full grid-cols-[240px_1fr_240px]">
      <div className="flex flex-col border-r bg-background p-4">
        <div className="mb-4 font-semibold">Database Credentials</div>
        <div className="grid gap-2">
          <div className="grid gap-1">

            <Label htmlFor="host">Host</Label>
            <Input id="host" placeholder="localhost" onChange={(e) => setHost(e.target.value)} value={Host} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="port">Port</Label>
            <Input id="port" placeholder="5432" onChange={(e) => setPort(e.target.value)} value={Port} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="username">User</Label>
            <Input id="username" placeholder="your-username" onChange={(e) => setUser(e.target.value)} value={User} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="database">Database</Label>
            <Input id="database" placeholder="your-database" onChange={(e) => setDatabase(e.target.value)} value={Database} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="your-password" onChange={(e) => setPassword(e.target.value)} value={Password} />
          </div>
        </div>
        <Button className="mt-4" onClick={() => connectToDB()}>Connect</Button>
      </div>

      <div className="flex flex-col items-center justify-center bg-muted/40 p-4">
        {/* chart */}
        <div className="mt-8 w-[1000px]">
          <div className="space-y-2 w-full aspect-[6/3] flex items-center justify-center">
            {selectedChart == "" ? (
              <div>
                <h1 className="text-5xl font-bold">Welcome to Visualisation</h1>
                <h2 className="text-3xl font-semibold">Let's get started</h2>
              </div>
            ) : (
              <>
                {
                  selectedChart == "Line" &&
                  <div className="w-full aspect-w-6 aspect-h-3">

                    {LinearType == "Normal" && (
                      <div className="w-full h-full">
                        <Normal Data={Data} />
                      </div>
                    )}
                    {LinearType == "Step" && (
                      <div className="w-full h-full">
                        <Step Data={Data} />
                      </div>
                    )}
                    {LinearType == "Linear" && (
                      <div className="w-full h-full">
                        <Linear Data={Data} />
                      </div>
                    )}
                    {LinearType == "Dots" && (
                      <div className="w-full h-full">
                        <Dots Data={Data} />
                      </div>
                    )}
                    {LinearType == "DotsColor" && (
                      <div className="w-full h-full">
                        <DotsColor Data={Data} />
                      </div>
                    )}
                    {LinearType == "Label" && (
                      <div className="w-full h-full">
                        <LabelLine Data={Data} />
                      </div>
                    )}
                    {LinearType == "CustomDots" && (
                      <div className="w-full h-full">
                        <CustomDots Data={Data} />
                      </div>
                    )}
                  </div>
                }

                {
                  selectedChart == "Pie" &&
                  <div className="w-full aspect-w-6 aspect-h-3">
                    {PieType == "Donut" && (
                      <div className="w-full h-full">
                        <Donut Data={Data}/>
                      </div>
                    )}
                    {PieType == "DonutText" && (
                      <div className="w-full h-full">
                        <DonutText Data={Data}/>
                      </div>
                    )}
                    {PieType == "DonutActive" && (
                      <div className="w-full h-full">
                        <DonutActive Data={Data}/>
                      </div>
                    )}
                    {PieType == "Label" && (
                      <div className="w-full h-full">
                        <LabelPie Data={Data}/>
                      </div>
                    )}
                    {PieType == "LabelList" && (
                      <div className="w-full h-full">
                        <Labellist Data={Data}/>
                      </div>
                    )}
                  </div>
                }
              </>
            )}
          </div>
        </div>
      </div>


      <div className="flex flex-col border-l bg-background p-4">

        <div className="mt-4 font-semibold text-xl">Export</div>
        <div className="grid gap-2">
          <Button variant="outline" size="sm" className="justify-start bg-black text-white">
            <FileIcon className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" size="sm" className="justify-start bg-black text-white">
            <FileIcon className="h-4 w-4 mr-2" />
            JSON
          </Button>
          <Button variant="outline" size="sm" className="justify-start bg-black text-white">
            <FileIcon className="h-4 w-4 mr-2" />
            Excel
          </Button>
        </div>

        <div className="mt-4">
          <div className="font-semibold text-xl">Select Tables</div>
          <div className="mt-2">
            <DropdownMenu>
              <DropdownMenuContent align="end">
                {schema && Object.keys(schema).map((table) => (
                  <DropdownMenuItem key={table} onSelect={() => handleTableChange(table)}>
                    {table}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-2">
            <Select onValueChange={handleTableChange}>
              <SelectTrigger className="w-[180px] bg-black text-white">
                <SelectValue placeholder="Select Table" value={selectedTable} />
              </SelectTrigger>
              <SelectContent>
                {schema && Object.keys(schema).map((table) => (
                  <SelectItem key={table} value={table}>
                    {table}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2">
            <Select onValueChange={setSelectedColumn}>
              <SelectTrigger className="w-[180px] bg-black text-white">
                <SelectValue placeholder="Select Column" value={selectedColumn} />
              </SelectTrigger>
              <SelectContent>
                {selectedTable && schema && schema[selectedTable] &&
                  Object.keys(schema[selectedTable]).map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2">
            <Select onValueChange={setSelectedColumn2}>
              <SelectTrigger className="w-[180px] bg-black text-white">
                <SelectValue placeholder="Select Column" value={selectedColumn2} />
              </SelectTrigger>
              <SelectContent>
                {selectedTable && schema && schema[selectedTable] &&
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
          <div className="font-semibold text-xl">Chart Options</div>

          {/* count and sum */}
          <div className="flex gap-x-3">
            <div className="mt-2">
              {
                selectedChart == "Bar"  &&
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-black text-white hover:bg-gray-900 hover:text-white">
                      {options === '0' ? 'Sum' : 'Count'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup value={options} onValueChange={setoptions}>
                      <DropdownMenuRadioItem value="0">Sum</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="1">Count</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
              {
                selectedChart == "Pie"  &&
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-black text-white hover:bg-gray-900 hover:text-white">
                      {options === '0' ? 'Sum' : 'Count'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup value={options} onValueChange={setoptions}>
                      <DropdownMenuRadioItem value="0">Sum</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="1">Count</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
            </div>
            <div className="mt-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-x-2">
                    <PaletteIcon className="h-4 w-4" />
                    Color Gradient
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup value="default">
                    <DropdownMenuRadioItem value="default">Default</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="rainbow">Rainbow</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="pastel">Pastel</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="neon">Neon</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>


          <div className="flex gap-x-3">
          <div className="mt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-black text-white  hover:bg-gray-900 hover:text-white">
                  <BarChartIcon className="h-4 w-4" />
                  {
                    selectedChart == "" ? "Charts": selectedChart
                  }
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={selectedChart}>
                  <DropdownMenuRadioItem value="bar" onClick={() => setSelectedChart("Bar")}>Bar</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="line" onClick={() => setSelectedChart("Line")}>Line</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="area" onClick={() => setSelectedChart("Area")}>Area</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="pie" onClick={() => setSelectedChart("Pie")}>Pie</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>


          <div className="mt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-black text-white hover:bg-gray-900 hover:text-white">
                  <BarChartIcon className="h-4 w-4 " />
                  {LinearType == "" ? "Types": LinearType}
                  {PieType == "" ? "Types": PieType}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup >
                  {selectedChart === "Line" &&
                    <>
                      <DropdownMenuRadioItem value="Normal" onClick={() => setLinearType("Normal")}>Normal</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Step" onClick={() => setLinearType("Step")}>Step</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Linear" onClick={() => setLinearType("Linear")}>Linear</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Dots" onClick={() => setLinearType("Dots")}>Dots</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="DotsColor" onClick={() => setLinearType("DotsColor")}>DotsColor</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Label" onClick={() => setLinearType("Label")}>Label</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="CustomDots" onClick={() => setLinearType("CustomDots")}>CustomDots</DropdownMenuRadioItem>
                    </>
                  }
                  {selectedChart === "Bar" &&
                    <>
                      <DropdownMenuRadioItem value="Normal">bar</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Step">bar</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Linear">bar</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Dots">bar</DropdownMenuRadioItem>
                    </>
                  }

                  {selectedChart === "Area" &&
                    <>
                      <DropdownMenuRadioItem value="Normal">Area</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Step">Area</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Linear">Area</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Dots">Area</DropdownMenuRadioItem>
                    </>
                  }

                  {selectedChart === "Pie" &&
                    <>
                      <DropdownMenuRadioItem onClick={() => setPieType("Donut")} value="Donut">Donut</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem onClick={() => setPieType("DonutText")} value="DonutText">DonutText</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem onClick={() => setPieType("DonutActive")} value="DonutActive">DonutActive</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem onClick={() => setPieType("Label")} value="Label">Label</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem onClick={() => setPieType("LabelList")} value="LabelList">LabelList</DropdownMenuRadioItem>
                    </>
                  }

                </DropdownMenuRadioGroup>

              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          </div>

          <div className="mt-2 text-center ">
            <Button className="bg-black w-full" onClick={Chart}>Generate</Button>
          </div>
        </div>
      </div>
    </div>


  )
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
  )
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
  )
}


function LinechartChart(props: any) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
          },
        }}
      >
        <LineChart
          accessibilityLayer
          data={[
            { month: "January", desktop: 186 },
            { month: "February", desktop: 305 },
            { month: "March", desktop: 237 },
            { month: "April", desktop: 73 },
            { month: "May", desktop: 209 },
            { month: "June", desktop: 214 },
          ]}
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
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Line dataKey="desktop" type="natural" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  )
}


function PaletteIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  )
}


function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}


function XIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}