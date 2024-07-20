"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";

const ERDiagram = dynamic(() => import("@/components/ERDiagram"), {
  ssr: false,
});

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(`${API_KEY}`);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function Component() {
  const [diagramType, setDiagramType] = useState("er-diagram");
  const [searchTerm, setSearchTerm] = useState("");
  const [diagramDefinition, setDiagramDefinition] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDiagramTypeChange = (type) => {
    setDiagramType(type);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      setLoading(true);
      const prompt = `You are a Senior Database Analyst. I will give you a prompt about a database. You need to accordingly write me the code in Mermaid.js for version 10.9.1 to generate the same. Make sure that the diagram is very advanced and appealing. The prompt is ${searchTerm} and type of diagram is ${diagramType}. Provide me only the code that should have been start and end and nothing else. The diagram should also have a title. If any other prompt given not related to your position as Senior Database Analyst please return anything like provide a valid prompt.`;
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = await response.text();
      const cleanedText = text
        .replace(/```/g, "")
        .replace(/^mermaid/, "")
        .trim();
      setDiagramDefinition(cleanedText);
      console.log(cleanedText);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for diagrams..."
            className="w-full rounded-md bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchTerm}
            onChange={handleSearch}
            onKeyPress={handleKeyPress}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <span>
                {diagramType === "er-diagram"
                  ? "ER Diagram"
                  : diagramType === "sequence-diagram"
                  ? "Sequence Diagram"
                  : diagramType === "class-diagram"
                  ? "Class Diagram"
                  : diagramType === "activity-diagram"
                  ? "Activity Diagram"
                  : "Other Diagram"}
              </span>
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem
              onClick={() => handleDiagramTypeChange("er-diagram")}
            >
              ER Diagram
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDiagramTypeChange("sequence-diagram")}
            >
              Sequence Diagram
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDiagramTypeChange("class-diagram")}
            >
              Class Diagram
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDiagramTypeChange("activity-diagram")}
            >
              Activity Diagram
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDiagramTypeChange("other")}>
              Other Diagram
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid gap-8">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader className="animate-spin h-6 w-6 text-primary" />
          </div>
        ) : (
          <ERDiagram diagramDefinition={diagramDefinition} />
        )}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>About Diagrams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  Diagrams are visual representations of complex systems,
                  processes, or relationships. They help to communicate
                  information in a clear and concise manner, making it easier to
                  understand and analyze.
                </p>
                <p>
                  There are various types of diagrams, each with its own purpose
                  and use case. Some common types include:
                </p>
                <ul className="list-disc space-y-1 pl-4">
                  <li>ER Diagram: Represents the structure of a database</li>
                  <li>
                    Sequence Diagram: Illustrates the flow of messages between
                    objects
                  </li>
                  <li>
                    Class Diagram: Models the structure of a software system
                    using classes and their relationships
                  </li>
                  <li>
                    Activity Diagram: Depicts the flow of activities in a
                    business process or workflow
                  </li>
                </ul>
                <p>
                  Diagrams can be a powerful tool for understanding and
                  communicating complex information. They can help to identify
                  potential issues, optimize processes, and facilitate
                  collaboration among team members.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ChevronDownIcon(props) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function XIcon(props) {
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
  );
}
