"use client"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
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
import { NormalBar } from "./(BarChart)/NormalBar"
import { LabelBar } from "./(BarChart)/LabelBar"
import { CustomLabel } from "./(BarChart)/CustomLabel"
import { Mixed } from "./(BarChart)/Mixed"
import { Active } from "./(BarChart)/Active"
import { Negative } from "./(BarChart)/Negative"
import { Horizontal } from "./(BarChart)/Horizontal"
import { DotsArea } from "./(AreaChart)/DotsArea"
import { GridFilled } from "./(AreaChart)/GridFilled"
import { GridCircle } from "./(AreaChart)/GridCircle"
import { GridCircleFilled } from "./(AreaChart)/GridCircleFilled"
import Cookies from "js-cookie"

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
  type InputType = Record<string, string>;

  const [Data, setdata] =useState<InputType>();
  // const [Data1, setdata1] = useState(input);


  const handleTableChange = (value: any) => {
    console.log("Table-->", value);
    setSelectedTable(value);
    setSelectedColumn("");
    setSelectedColumn2("");
  };



  const JSONFORMATTER = async (response: any) => {
    // const tableInfo = response?.data?.tables_info;


    const prompt = `I will provide a json message please correct it in the proper format and return me just the final json  output and nothing else, the message is ${response}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  }


  // testing for parsing ------>
  // const test = {
  //   status: "success",
  //   tables_info: "{\"announcements\":{\"id\":\"INTEGER\",\"content\":\"VARCHAR(255)\",\"course_id\":\"INTEGER\",\"name\":\"VARCHAR(255)\"},\"assignments\":{\"id\":\"INTEGER\",\"assignment_name\":\"VARCHAR(255)\",\"deadline\":\"DATETIME(6)\",\"description\":\"VARCHAR(255)\",\"course_id\":\"INTEGER\",\"full_marks\":\"INTEGER\"},\"course_archived_users\":{\"course_id\":\"INTEGER\",\"archived_user_id\":\"INTEGER\"},\"courses\":{\"id\":\"INTEGER\",\"course_name\":\"VARCHAR(255)\",\"instructor_id\":\"INTEGER\",\"code\":\"VARCHAR(255)\",\"meeting_link\":\"VARCHAR(255)\",\"cover_photo\":\"VARCHAR(255)\"},\"doubt\":{\"id\":\"INTEGER\",\"content\":\"VARCHAR(255)\",\"course_id\":\"INTEGER\",\"user_id\":\"INTEGER\"},\"enrolled_users_courses\":{\"course_id\":\"INTEGER\",\"user_id\":\"INTEGER\"},\"files\":{\"id\":\"INTEGER\",\"file_name\":\"VARCHAR(255)\",\"file_path\":\"VARCHAR(255)\",\"submission_id\":\"INTEGER\",\"assignment_id\":\"INTEGER\",\"announcement_id\":\"INTEGER\"},\"form\":{\"id\":\"INTEGER\"},\"form_item\":{\"id\":\"INTEGER\",\"question\":\"VARCHAR(255)\",\"answer\":\"VARCHAR(255)\",\"options\":\"VARBINARY(255)\"},\"message\":{\"id\":\"INTEGER\",\"chat_id\":\"INTEGER\",\"sender_id\":\"INTEGER\",\"content\":\"VARCHAR(10000)\",\"course_id\":\"INTEGER\",\"type\":\"VARCHAR(255)\",\"doubt_id\":\"INTEGER\"},\"private_chat\":{\"id\":\"INTEGER\",\"assignment_id\":\"INTEGER\",\"user_id\":\"INTEGER\"},\"submissions\":{\"id\":\"INTEGER\",\"late_status\":\"BIT(1)\",\"submission_date_time\":\"DATETIME(6)\",\"assignment_id\":\"INTEGER\",\"user_id\":\"INTEGER\",\"marks\":\"INTEGER\",\"comment\":\"VARCHAR(255)\"},\"users\":{\"id\":\"INTEGER\",\"email\":\"VARCHAR(255)\",\"first_name\":\"VARCHAR(255)\",\"last_name\":\"VARCHAR(255)\",\"password\":\"VARCHAR(255)\",\"role\":\"ENUM(\"\"INSTRUCTOR\"\",\"\"STUDENT\"\")\",\"reset_password_token\":\"VARCHAR(255)\",\"reset_password_token_expires\":\"DATETIME(6)\"}}"
  // }

  // const funtion =async()=>{
  //   try {
  //     let result = await JSONFORMATTER(test.tables_info);
  //     result = result.slice(7, -3);
  //     console.log('RE', result);
  //     const Finalschema = JSON.parse(result);
  //     console.log("schema2", Finalschema);
  //     toast({
  //       variant: "success",
  //       title: "Connection Successful",
  //       description: "The connection was successful.",
  //     });
  //   } catch (error:any) {
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description: error.message || "An unexpected error occurred.",
  //       action: <ToastAction altText="Try again">Try again</ToastAction>,
  //     });
  //   }
  // }

  // useEffect(() => {
  //   funtion();
  // }, []);


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

      // console.log(response);
      if (response) {
        Cookies.set("db", response?.data?.db);
        let value = await JSONFORMATTER(response?.data?.tables_info);

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
      Type: selectedChart,
      Option: options,
    };
  
    if (!data.table || !data.first_column || !data.second_column) {
      toast({
        title: "Generation Failed",
        variant: "destructive",
        description: "Please provide table and column values to generate the Charts.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return; 
    }

    try {
      let response = await axios.post(
        "http://127.0.0.1:5000/fetch-table-data",
        {...data, "db": Cookies.get("db")},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const firstData = JSON.parse(response.data[`${selectedColumn}`]);
      const secondData = JSON.parse(response.data[`${selectedColumn2}`]);
  
      const convertAndFilterData = (data: any) => {
        return data
          .map((item: any) => (item === "None" ? 0 : item))
          .filter((item: any) => item !== "None");
      };
  
      const convertedFirstData = convertAndFilterData(firstData);
      const convertedSecondData = convertAndFilterData(secondData);
  
      console.log("convertedFirstData", convertedFirstData);
      console.log("convertedSecondData", convertedSecondData);
      console.log("response", response);
  
      const minLength = Math.min(convertedFirstData.length, convertedSecondData.length);
      const formattedData = Array.from({ length: minLength }, (_, index) => ({
        [selectedColumn]: convertedFirstData[index],
        [selectedColumn2]: convertedSecondData[index],
      }));
  
      console.log("FormattedData", formattedData);
      setdata(formattedData);
  
      if (response.data.status === "success") {
        toast({
          variant: "success",
          title: "Generated Successfully",
          description: "The connection was successful.",
        });
      } else {
        toast({
          title: "Connection Failed",
          variant: "destructive",
          description: response.data.message || "There was an error connecting.",
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
  };
  
  

  // DOWNLOAD HANDLER
  const downloadDiagram = () => {
    const svgElement = document.querySelector(".chart") as SVGElement;
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Chart.svg";
      link.click();
      URL.revokeObjectURL(url);
    }
  };
  


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
        <div className="mt-8 w-[1000px] chart">
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
                        <Donut Data={Data} />
                      </div>
                    )}
                    {PieType == "DonutText" && (
                      <div className="w-full h-full">
                        <DonutText Data={Data} />
                      </div>
                    )}
                    {PieType == "DonutActive" && (
                      <div className="w-full h-full">
                        <DonutActive Data={Data} />
                      </div>
                    )}
                    {PieType == "Label" && (
                      <div className="w-full h-full">
                        <LabelPie Data={Data} />
                      </div>
                    )}
                    {PieType == "LabelList" && (
                      <div className="w-full h-full">
                        <Labellist Data={Data} />
                      </div>
                    )}
                  </div>
                }

                {
                  selectedChart == "Bar" &&
                  <div className="w-full aspect-w-6 aspect-h-3">
                    {BarType == "NormalBar" && (
                      <div className="w-full h-full">
                        <NormalBar Data={Data} />
                      </div>
                    )}
                    {BarType == "LabelBar" && (
                      <div className="w-full h-full">
                        <LabelBar Data={Data} />
                      </div>
                    )}
                    {BarType == "CustomLabel" && (
                      <div className="w-full h-full">
                        <CustomLabel Data={Data} />
                      </div>
                    )}
                    {BarType == "Mixed" && (
                      <div className="w-full h-full">
                        <Mixed Data={Data} />
                      </div>
                    )}
                    {BarType == "Active" && (
                      <div className="w-full h-full">
                        <Active Data={Data} />
                      </div>
                    )}
                    {BarType == "Negative" && (
                      <div className="w-full h-full">
                        <Negative Data={Data} />
                      </div>
                    )}
                    {BarType == "Horizontal" && (
                      <div className="w-full h-full">
                        <Horizontal Data={Data} />
                      </div>
                    )}
                  </div>
                }

                {
                  selectedChart == "Area" &&
                  <div className="w-full aspect-w-6 aspect-h-3">

                    {AreaType == "Dots" && (
                      <div className="w-full h-full">
                        <DotsArea Data={Data} />
                      </div>
                    )}
                    {AreaType == "GridFilled" && (
                      <div className="w-full h-full">
                        <GridFilled Data={Data} />
                      </div>
                    )}
                    {AreaType == "GridCircle" && (
                      <div className="w-full h-full">
                        <GridCircle Data={Data} />
                      </div>
                    )}
                    {AreaType == "GridCircleFilled" && (
                      <div className="w-full h-full">
                        <GridCircleFilled Data={Data} />
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
          <Button variant="outline" size="sm" className="justify-start bg-black text-white" onClick={()=> downloadDiagram()}>
            <FileIcon className="h-4 w-4 mr-2" />
            SVG
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
                selectedChart == "Bar" &&
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
                selectedChart == "Pie" &&
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
                      selectedChart == "" ? "Charts" : selectedChart
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
                    {LinearType == "" ? "Types" : LinearType}
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
                        <DropdownMenuRadioItem onClick={() => setBarType("NormalBar")} value="NormalBar">NormalBar</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem onClick={() => setBarType("Negative")} value="Negative">Negative</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem onClick={() => setBarType("Mixed")} value="Mixed">Mixed</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem onClick={() => setBarType("LabelBar")} value="LabelBar">LabelBar</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem onClick={() => setBarType("Horizontal")} value="Horizontal">Horizontal</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem onClick={() => setBarType("CustomLabel")} value="CustomLabel">CustomLabel</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem onClick={() => setBarType("Active")} value="Active">Active</DropdownMenuRadioItem>
                      </>
                    }

                    {selectedChart === "Area" &&
                      <>
                        <DropdownMenuRadioItem onClick={() => setAreaType("Dots")} value="Dots">Dots</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem onClick={() => setAreaType("GridFilled")} value="GridFilled">GridFilled</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem onClick={() => setAreaType("GridCircle")} value="GridCircle">GridCircle</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem onClick={() => setAreaType("GridCircleFilled")} value="GridCircleFilled">GridCircleFilled</DropdownMenuRadioItem>
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
            <Button className="bg-black w-full" onClick={()=>Chart()}>Generate</Button>
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