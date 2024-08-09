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
import Link from "next/link"

export default function Component() {

  const { toast } = useToast();

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const [selectedChart, setSelectedChart] = useState("");
  const [LinearType, setLinearType] = useState("");
  const [BarType, setBarType] = useState("");
  const [AreaType, setAreaType] = useState("");
  const [PieType, setPieType] = useState("");
  const [isClicked, setisClicked] = useState(true);

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

  const [Data, setdata] = useState<InputType>();
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
        { ...data, "db": Cookies.get("db") },
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
      setisClicked(false);
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
    <div className="grid min-h-screen w-full lg:grid-cols-[300px_1fr_300px] grid-cols-1">

      {/* FIRST SECTION */}
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
            <Input id="host" placeholder="localhost" onChange={(e) => setHost(e.target.value)} value={Host} />
          </div>
          <div className="grid gap-1">
            <Input id="port" placeholder="port" onChange={(e) => setPort(e.target.value)} value={Port} />
          </div>
          <div className="grid gap-1">
            <Input id="username" placeholder="username" onChange={(e) => setUser(e.target.value)} value={User} />
          </div>
          <div className="grid gap-1">
            <Input id="database" placeholder="database" onChange={(e) => setDatabase(e.target.value)} value={Database} />
          </div>
          <div className="grid gap-1">
            <Input id="password" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} value={Password} />
          </div>
          <div className="grid gap-1">
            <Button className="mt-4 w-full py-2 px-4 rounded border-none" onClick={() => connectToDB()}>
              Connect
            </Button>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION */}
      <div className="flex flex-col items-center justify-center bg-muted/40 p-4 flex-grow">
        {/* chart */}
        <div className="mt-8 w-full max-w-[800px] chart">
          <div className="space-y-2 w-full aspect-[6/3] flex items-center justify-center">
            {isClicked ? (
              <div className="space-y-2 lg:text-start text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Welcome to Vision AI</h1>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">
                  Pioneering the Future of Intelligent Solutions
                </h2>
                <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
                  Start a conversation by connecting to a chat server.
                </p>
              </div>
            ) : (
              <>
                {selectedChart == "Line" && (
                  <div className="w-full aspect-w-6 aspect-h-3">
                    {/* Line types */}
                    {LinearType == "Normal" && <Normal Data={Data} />}
                    {LinearType == "Step" && <Step Data={Data} />}
                    {LinearType == "Linear" && <Linear Data={Data} />}
                    {LinearType == "Dots" && <Dots Data={Data} />}
                    {LinearType == "DotsColor" && <DotsColor Data={Data} />}
                    {LinearType == "Label" && <LabelLine Data={Data} />}
                    {LinearType == "CustomDots" && <CustomDots Data={Data} />}
                  </div>
                )}

                {selectedChart == "Pie" && (
                  <div className="w-full aspect-w-6 aspect-h-3">
                    {/* Pie types */}
                    {PieType == "Donut" && <Donut Data={Data} />}
                    {PieType == "DonutText" && <DonutText Data={Data} />}
                    {PieType == "DonutActive" && <DonutActive Data={Data} />}
                    {PieType == "Label" && <LabelPie Data={Data} />}
                    {PieType == "LabelList" && <Labellist Data={Data} />}
                  </div>
                )}

                {selectedChart == "Bar" && (
                  <div className="w-full aspect-w-6 aspect-h-3">
                    {/* Bar types */}
                    {BarType == "NormalBar" && <NormalBar Data={Data} />}
                    {BarType == "LabelBar" && <LabelBar Data={Data} />}
                    {BarType == "CustomLabel" && <CustomLabel Data={Data} />}
                    {BarType == "Mixed" && <Mixed Data={Data} />}
                    {BarType == "Active" && <Active Data={Data} />}
                    {BarType == "Negative" && <Negative Data={Data} />}
                    {BarType == "Horizontal" && <Horizontal Data={Data} />}
                  </div>
                )}
                {selectedChart == "Area" && (
                  <div className="w-full aspect-w-6 aspect-h-3">
                    {/* Area types */}
                    {AreaType == "Dots" && <DotsArea Data={Data} />}
                    {AreaType == "GridFilled" && <GridFilled Data={Data} />}
                    {AreaType == "GridCircle" && <GridCircle Data={Data} />}
                    {AreaType == "GridCircleFilled" && <GridCircleFilled Data={Data} />}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>


      {/* THIRD SECTION */}
      <div className="flex flex-col border-l bg-background p-4 flex-none  w-full md:w-[320px] lg:w-[280px]">
        <div className="mt-4 font-semibold text-xl">Export</div>
        <div className="grid gap-2">
          <Button variant="outline" size="sm" className="justify-start bg-black text-white" onClick={() => downloadDiagram()} disabled={isClicked}>
            <FileIcon className="h-4 w-4 mr-2" />
            SVG
          </Button>
        </div>

        <div className="mt-4">
          <div className="font-semibold text-xl">Table</div>
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
              <SelectTrigger className="lg:w-[180px] w-full bg-black text-white">
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
          <div className="font-semibold text-xl mt-4">Columns</div>
          <div className="mt-2">
            <Select onValueChange={setSelectedColumn}>
              <SelectTrigger className="lg:w-[180px] w-full bg-black text-white">
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
              <SelectTrigger className="lg:w-[180px] w-full bg-black text-white">
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
          <div className="font-semibold text-xl">Chart</div>

          {/* Count and Sum */}
          <div className="flex gap-x-3">
            <div className="mt-2 w-full">
              {selectedChart == "Bar" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-black text-white hover:bg-gray-900 hover:text-white  w-full">
                      {options === '0' ? 'Sum' : 'Count'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup value={options} onValueChange={setoptions} >
                      <DropdownMenuRadioItem value="0">Sum</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="1">Count</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {selectedChart == "Pie" && (
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
              )}
            </div>
          </div>

          <div className="flex gap-x-3 justify-center w-full">
            <div className="mt-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-black text-white hover:bg-gray-900 hover:text-white">
                    <BarChartIcon className="h-4 w-4" />
                    {selectedChart == "" ? "Charts" : selectedChart}
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
                    <BarChartIcon className="h-4 w-4" />
                    {LinearType == "" ? "Types" : LinearType}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup>
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

          <div className="mt-2 text-center">
            <Button className="bg-black w-full" onClick={() => Chart()}>Generate</Button>
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

