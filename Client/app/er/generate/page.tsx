"use client";

import { useState, ChangeEvent, KeyboardEvent } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, Download } from "lucide-react";
import { ComponentState, DiagramType } from "@/types";
import axios from "axios";
import { diagramTypeLabels, ENTER_KEY_PRESS_SET, generate_mermaid_code_prompt } from "@/lib/utils";

const ERDiagram = dynamic(() => import("@/components/ERDiagram"), {
  ssr: false,
});

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function Component() {
  const [state, setState] = useState<ComponentState>({
    diagramType: "er-diagram",
    searchTerm: "",
    diagramDefinition: "",
    content: false,
    loading: false,
  });

  const handleDiagramTypeChange = (type: DiagramType) => {
    setState((prev) => ({ ...prev, diagramType: type }));
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, searchTerm: e.target.value }));
  };

  /* HANDLER FUNCTION TO GENERATE DB DIAGRAM THROUGH USER DEFINED PROMPT */
  const handleKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (ENTER_KEY_PRESS_SET.has(e.key)) {
      setState((prev) => ({ ...prev, loading: true }));
      const prompt = generate_mermaid_code_prompt(
        state.searchTerm,
        state.diagramType
      );
      try {
        const response = await axios.post(`${BASE_URL}/image/generate`, {
          prompt: prompt,
        });
        const result = response.data.generatedContent;
        const cleanedText = result
          .replace(/```/g, "")
          .replace(/^mermaid/, "")
          .trim();
        setState((prevState) => ({
          ...prevState,
          diagramDefinition: cleanedText,
          content: true,
          loading: false,
        }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  /* HANDLER FUNCTION TO DOWNLOAD DB DIAGRAM */
  const downloadDiagram = () => {
    const svgElement = document.querySelector(".mermaid svg") as SVGElement;
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "diagram.svg";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  /* HANDLER FUNCTION TO GENERATE DB DIAGRAM THROUGH PREDEFINED PROMPT */
  const handleGenerateClick = async (content: string) => {
    setState((prevState) => ({
      ...prevState,
      searchTerm: content,
      loading: true,
    }));

    const prompt = generate_mermaid_code_prompt(
      state.searchTerm,
      state.diagramType
    );
    try {
      const response = await axios.post(`${BASE_URL}/image/generate`, {
        prompt: prompt,
      });
      const result = response.data.generatedContent;
      const cleanedText = result
        .replace(/```/g, "")
        .replace(/^mermaid/, "")
        .trim();
      setState((prev) => ({
        ...prev,
        diagramDefinition: cleanedText,
        content: true,
        loading: false,
      }));
    } catch (err) {
      console.error(err);
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
            value={state.searchTerm}
            onChange={handleSearch}
            onKeyPress={handleKeyPress}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-2 bg-black text-white tracking-wide font-bold">
              <span>{diagramTypeLabels[state.diagramType as DiagramType]}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-black text-white">
            <DropdownMenuItem
              onClick={() => handleDiagramTypeChange("er-diagram")}
              className="hover:bg-muted"
            >
              ER Diagram
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDiagramTypeChange("sequence-diagram")}
              className="hover:bg-muted"
            >
              Sequence Diagram
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDiagramTypeChange("class-diagram")}
              className="hover:bg-muted"
            >
              Class Diagram
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDiagramTypeChange("state-diagram")}
              className="hover:bg-muted"
            >
              State Diagram
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid gap-8">
        {state.loading ? (
          <div className="inline-flex justify-center items-center h-48">
            <Loader className="animate-spin h-6 w-6 text-primary" />
          </div>
        ) : (
          <>
            <ERDiagram diagramDefinition={state.diagramDefinition} />
          </>
        )}
        {state.content && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={downloadDiagram}
              className="inline-flex items-center gap-2 bg-black text-white text-sm px-2 py-2 w-[150px]"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-[#f8f9fa]">
            <CardContent>
              <p className="mt-4 text-justify">
                Design an ER diagram for an e-commerce database, including
                entities like Products, Categories, Orders, Customers, and
                Payments
              </p>
              <div className="flex justify-center">
                <Button
                  className="mt-4 bg-black text-white font-bold"
                  onClick={() =>
                    handleGenerateClick(
                      "Design an ER diagram for an e-commerce database, including entities like Products, Categories, Orders, Customers, and Payments"
                    )
                  }
                >
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#f8f9fa]">
            <CardContent>
              <p className="mt-4">
                Create a sequence diagram for a user login flow, depicting the
                interactions between the User, Login Service, Authentication
                Service, and Database
              </p>
              <div className="flex justify-center">
                <Button
                  className="mt-4 bg-black text-white font-bold"
                  onClick={() =>
                    handleGenerateClick(
                      "Create a sequence diagram for a user login flow, depicting the interactions between the User, Login Service, Authentication Service, and Database"
                    )
                  }
                >
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#f8f9fa]">
            <CardContent>
              <p className="mt-4">
                Generate a class diagram for a banking application, including
                classes like Account, Transaction, Customer, and Loan, along
                with their attributes and methods
              </p>
              <div className="flex justify-center">
                <Button
                  className="mt-4 bg-black text-white font-bold"
                  onClick={() =>
                    handleGenerateClick(
                      "Generate a class diagram for a banking application, including classes like Account, Transaction, Customer, and Loan, along with their attributes and methods"
                    )
                  }
                >
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#f8f9fa]">
            <CardContent>
              <p className="mt-4">
                Diagram the activity flow for a product checkout process,
                including steps like Add to Cart, Select Shipping, Enter
                Payment, and Complete Order
              </p>
              <div className="flex justify-center">
                <Button
                  className="mt-4 bg-black text-white font-bold"
                  onClick={() =>
                    handleGenerateClick(
                      "Diagram the activity flow for a product checkout process, including steps like Add to Cart, Select Shipping, Enter Payment, and Complete Order"
                    )
                  }
                >
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#f8f9fa]">
            <CardContent className="mt-4">
              <p>
                Design an ER diagram for a social media platform including
                entities: Users, Posts, Comments, Likes, and Friendships, and
                their relationships.
              </p>
              <div className="flex justify-center">
                <Button
                  className="mt-4 bg-black text-white font-bold"
                  onClick={() =>
                    handleGenerateClick(
                      "Design an ER diagram for a social media platform including entities: Users, Posts, Comments, Likes, and Friendships, and their relationships."
                    )
                  }
                >
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#f8f9fa]">
            <CardContent className="mt-4">
              <p>
                Design a class diagram for a library management system,
                including classes: Library, Book, Member, Staff, Loan, and
                Reservation, and their relationships.
              </p>
              <div className="flex justify-center">
                <Button
                  className="mt-4 bg-black text-white font-bold"
                  onClick={() =>
                    handleGenerateClick(
                      "Design a class diagram for a library management system, including classes: Library, Book, Member, Staff, Loan, and Reservation, and their relationships."
                    )
                  }
                >
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">About Diagrams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-base">
                <p>
                  Design an ER diagram for a social media platform including
                  entities: Users, Posts, Comments, Likes, and Friendships, and
                  their relationships.
                </p>
                <p>
                  There are various types of diagrams, each with its own purpose
                  and use case. Some common types include:
                </p>
                <ul className="list-disc space-y-1 pl-4">
                  <li>
                    <span className="font-bold">ER Diagram</span>: Represents
                    the structure of a database
                  </li>
                  <li>
                    <span className="font-bold">Sequence Diagram</span>:
                    Illustrates the flow of messages between objects
                  </li>
                  <li>
                    <span className="font-bold">Class Diagram</span>: Models the
                    structure of a software system using classes and their
                    relationships
                  </li>
                  <li>
                    <span className="font-bold">Activity Diagram</span>: Depicts
                    the flow of activities in a business process or workflow
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

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
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

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
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
  );
}
