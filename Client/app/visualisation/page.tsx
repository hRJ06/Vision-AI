"use client"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { Dots } from "./LineChart/Dots"
import { Linear } from "./LineChart/Linear"
import { Normal } from "./LineChart/Normal"
import { Step } from "./LineChart/Step"

const databaseSchema = `{
  "announcements": {
    "id": "INTEGER",
    "content": "VARCHAR(255)",
    "course_id": "INTEGER",
    "name": "VARCHAR(255)"
  },
  "assignments": {
    "id": "INTEGER",
    "assignment_name": "VARCHAR(255)",
    "deadline": "DATETIME(6)",
    "description": "VARCHAR(255)",
    "course_id": "INTEGER",
    "full_marks": "INTEGER"
  },
  "course_archived_users": {
    "course_id": "INTEGER",
    "archived_user_id": "INTEGER"
  },
  "courses": {
    "id": "INTEGER",
    "course_name": "VARCHAR(255)",
    "instructor_id": "INTEGER",
    "code": "VARCHAR(255)",
    "meeting_link": "VARCHAR(255)",
    "cover_photo": "VARCHAR(255)"
  },
  "doubt": {
    "id": "INTEGER",
    "content": "VARCHAR(255)",
    "course_id": "INTEGER",
    "user_id": "INTEGER"
  },
  "enrolled_users_courses": {
    "course_id": "INTEGER",
    "user_id": "INTEGER"
  },
  "files": {
    "id": "INTEGER",
    "file_name": "VARCHAR(255)",
    "file_path": "VARCHAR(255)",
    "submission_id": "INTEGER",
    "assignment_id": "INTEGER",
    "announcement_id": "INTEGER"
  },
  "form": {
    "id": "INTEGER"
  },
  "form_item": {
    "id": "INTEGER",
    "question": "VARCHAR(255)",
    "answer": "VARCHAR(255)",
    "options": "VARBINARY(255)"
  },
  "message": {
    "id": "INTEGER",
    "chat_id": "INTEGER",
    "sender_id": "INTEGER",
    "content": "VARCHAR(10000)",
    "course_id": "INTEGER",
    "type": "VARCHAR(255)",
    "doubt_id": "INTEGER"
  },
  "private_chat": {
    "id": "INTEGER",
    "assignment_id": "INTEGER",
    "user_id": "INTEGER"
  },
  "submissions": {
    "id": "INTEGER",
    "late_status": "BIT(1)",
    "submission_date_time": "DATETIME(6)",
    "assignment_id": "INTEGER",
    "user_id": "INTEGER",
    "marks": "INTEGER",
    "comment": "VARCHAR(255)"
  },
  "users": {
    "id": "INTEGER",
    "email": "VARCHAR(255)",
    "first_name": "VARCHAR(255)",
    "last_name": "VARCHAR(255)",
    "password": "VARCHAR(255)",
    "role": "ENUM('INSTRUCTOR','STUDENT')",
    "reset_password_token": "VARCHAR(255)",
    "reset_password_token_expires": "DATETIME(6)"
  }
}`;

export default function Component() {


  const [selectedChart, setSelectedChart] = useState("");
  const [LinearType, setLinearType] = useState("");
  const schema = JSON.parse(databaseSchema);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  


  const handleTableChange = (value: any) => {
    setSelectedTable(value);
    setSelectedColumn("");
  };







  return (
    <div className="grid min-h-screen w-full grid-cols-[240px_1fr_240px]">
      <div className="flex flex-col border-r bg-background p-4">
        <div className="mb-4 font-semibold">Database Credentials</div>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label htmlFor="host">Host</Label>
            <Input id="host" placeholder="localhost" />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="port">Port</Label>
            <Input id="port" placeholder="5432" />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="your-username" />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="your-password" />
          </div>
        </div>
        <Button className="mt-4">Connect</Button>
      </div>

      <div className="flex flex-col items-center justify-center bg-muted/40 p-4">
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex w-full items-center justify-between">
            <div className="font-semibold">Select Tables</div>
            <DropdownMenu>

              <DropdownMenuContent align="end">
                {Object.keys(schema).map((table) => (
                  <DropdownMenuItem key={table} onSelect={() => handleTableChange(table)}>
                    {table}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>

            </DropdownMenu>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Select onValueChange={handleTableChange} >
                  <SelectTrigger className="w-[180px] bg-black text-white">
                    <SelectValue placeholder="Select Table" value={selectedTable} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(schema).map((table) => (
                      <SelectItem key={table} value={table}>
                        {table}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={setSelectedColumn}>
                  <SelectTrigger className="w-[180px]  bg-black text-white" >
                    <SelectValue placeholder="Select Column" value={selectedColumn} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTable &&
                      Object.keys(schema[selectedTable]).map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={handleTableChange}>
                </Select>
                <Select onValueChange={setSelectedColumn}>
                  <SelectTrigger className="w-[180px] bg-black text-white" >
                    <SelectValue placeholder="Select Column" value={selectedColumn} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTable &&
                      Object.keys(schema[selectedTable]).map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>
        </div>




        <div className="mt-4 flex w-full items-center justify-between">
          <div className="flex gap-x-3">
            <div className="font-semibold text-2xl">Chart Options</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-black text-white hover:bg-gray-900 hover:text-white">
                  <BarChartIcon className="h-4 w-4 " />
                  {`${selectedChart} sub charts`}
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
                      <DropdownMenuRadioItem value="Normal">Pie</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Step">Pie</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Linear">Pie</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Dots">Pie</DropdownMenuRadioItem>
                    </>
                  }

                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-black text-white  hover:bg-gray-900 hover:text-white">
                  <BarChartIcon className="h-4 w-4" />
                  {`${selectedChart}  charts`}
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
        </div>
        <div className="mt-8 w-full">
          {selectedChart == "" ? (
            <div className="space-y-2 w-full aspect-[6/3] flex items-center justify-center">
              <div>
                <h1 className="text-5xl font-bold">Welcome to Visualisation</h1>
                <h2 className="text-3xl font-semibold">Let's get started</h2>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-w-6 aspect-h-3">  
              {LinearType == "Normal" && (
                <div className="w-full h-full">
                  <Normal />
                </div>
              )}
              {LinearType == "Step" && (
                <div className="w-full h-full">
                  <Step />
                </div>
              )}
              {LinearType == "Linear" && (
                <div className="w-full h-full">
                  <Linear />
                </div>
              )}
              {LinearType == "Dots" && (
                <div className="w-full h-full">
                  <Dots />
                </div>
              )}
            </div>
          )}
        </div>



      </div>
      <div className="flex flex-col border-l bg-background p-4">

        <div className="mt-4 font-semibold">Export</div>
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
      </div>
    </div>
  )
}

// function AreachartChart(props: any) {
//   return (
//     <div {...props}>
//       <ChartContainer
//         config={{
//           desktop: {
//             label: "Desktop",
//             color: "hsl(var(--chart-1))",
//           },
//         }}
//         className="min-h-[300px]"
//       >
//         <AreaChart
//           accessibilityLayer
//           data={[
//             { month: "January", desktop: 186 },
//             { month: "February", desktop: 305 },
//             { month: "March", desktop: 237 },
//             { month: "April", desktop: 73 },
//             { month: "May", desktop: 209 },
//             { month: "June", desktop: 214 },
//           ]}
//           margin={{
//             left: 12,
//             right: 12,
//           }}
//         >
//           <CartesianGrid vertical={false} />
//           <XAxis
//             dataKey="month"
//             tickLine={false}
//             axisLine={false}
//             tickMargin={8}
//             tickFormatter={(value) => value.slice(0, 3)}
//           />
//           <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
//           <Area
//             dataKey="desktop"
//             type="natural"
//             fill="var(--color-desktop)"
//             fillOpacity={0.4}
//             stroke="var(--color-desktop)"
//           />
//         </AreaChart>
//       </ChartContainer>
//     </div>
//   )
// }


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