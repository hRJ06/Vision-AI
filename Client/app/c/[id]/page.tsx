"use client";
export const fetchCache = "force-no-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToastAction } from "@/components/ui/toast";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
    AI_MESSAGE_ROLE_SET
} from "@/lib/utils";
import { ChatMessage, DatabaseCredentials } from "@/types";
import axios, { AxiosResponse } from "axios";
import { Download, DownloadIcon, EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { getAllMessages } from "@/lib/actions/chat.action";


export default function Component({ params }: { params: { id: string } }) {
    const { toast } = useToast();

    const [databaseCredentials, setDatabaseCredentials] =
        useState<DatabaseCredentials | null>(null);
    const [schemaInfo, setSchemaInfo] = useState<string>("");
    const [inputText, setInputText] = useState<string>("");
    const [name, setname] = useState<string>();
    const [chats, setChats] = useState<any>([])
    const chatID = params.id;


    /* FORMAT GEMINI RESPONSE */
    const formatMessage = (message: string): JSX.Element | JSX.Element[] => {
        const lines = message.split("\n");
        let isTable = false;
        const tableData: string[][] = [];
        lines.forEach((line) => {
            const columns = line
                .split("|")
                .map((col) => col.trim())
                .filter(Boolean);
            if (columns.length > 1) {
                isTable = true;
                tableData.push(columns);
            }
        });
        if (isTable && tableData.length > 1) {
            tableData.splice(1, 1);
            const headers = tableData[0];
            const rows = tableData.slice(1);
            return (
                <table
                    style={{ width: "100%", borderCollapse: "collapse", margin: "1em 0" }}
                >
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    style={{
                                        border: "1px solid #ddd",
                                        padding: "8px",
                                        textAlign: "left",
                                        backgroundColor: "#f2f2f2",
                                        borderBottom: "2px solid black",
                                    }}
                                >
                                    {header.charAt(0).toUpperCase() + header.slice(1)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td
                                        key={cellIndex}
                                        style={{
                                            border: "1px solid #ddd",
                                            padding: "8px",
                                        }}
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
        return lines.map((part, index) => {
            const isList = /^\d+\./.test(part.trim());
            const formattedPart = part
                .split(/(\*\*.*?\*\*|mailto:[^\s]+)/g)
                .map((subPart, subIndex) => {
                    if (subPart.startsWith("**") && subPart.endsWith("**")) {
                        return <b key={subIndex}>{subPart.slice(2, -2)}</b>;
                    } else if (subPart.startsWith("mailto:")) {
                        return (
                            <a key={subIndex} href={subPart} style={{ color: "blue" }}>
                                {subPart}
                            </a>
                        );
                    }
                    return subPart;
                });
            return (
                <div key={index} style={{ marginBottom: isList ? "0.5em" : "0" }}>
                    {formattedPart}
                </div>
            );
        });
    };

    /* DOWNLOAD HANDLER FOR IMAGE IN VISUALISATION RESPONSE */
    const handleDownload = useCallback(async (url: string): Promise<void> => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Error fetching image.");
            }
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Image.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading the image -", error);
        }
    }, []);


    useEffect(() => {
        GetAllMessages();
    }, [chatID]);


    const GetAllMessages = async () => {
        // console.log("ChatId ", chatID);
        try {
            let response = JSON.parse(await getAllMessages(chatID));
            // console.log("Response ", response );
            setChats(response.message);
            setname(response.name);
            // console.log("Message ", response.message);
            if (!response.success) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "Please Try Again.",
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


    console.log("Chats ", chats);



    return (
        <div className="min-h-screen w-full bg-background text-foreground flex flex-col">

            {/* Main Content */}
            <div className="flex flex-col flex-grow overflow-hidden">
                <div className="sticky top-0 z-10 border-b bg-background/50 p-4 backdrop-blur-md flex justify-between items-center">
                    <h1 className="text-xl lg:text-left text-center font-semibold">{name}</h1>
                    
                </div>


                <div className="flex-1 overflow-auto p-4">
                    <div className="flex flex-col gap-4">
                        {chats.map((chat: any) => (
                            <div
                                key={chat._id}
                                className={`flex items-start gap-4 ${AI_MESSAGE_ROLE_SET.has(chat.role) ? "" : "justify-end"
                                    }`}
                            >
                                <Avatar className="h-8 w-8 shrink-0 border">
                                    <AvatarImage
                                        src={`${AI_MESSAGE_ROLE_SET.has(chat.role) ? "/AI.png" : "/Human.png"
                                            }`}
                                    />
                                    <AvatarFallback>{chat.role}</AvatarFallback>
                                </Avatar>
                                <div className="max-w-[700px]">
                                    <div className="grid gap-1">
                                        <div
                                            className={`prose text-muted-foreground p-2 rounded-md ${AI_MESSAGE_ROLE_SET.has(chat.role)
                                                ? "bg-muted"
                                                : "bg-primary text-primary-foreground"
                                                }`}
                                        >
                                            {AI_MESSAGE_ROLE_SET.has(chat.role) ? (
                                                <>
                                                    <p>{formatMessage(chat.content)}</p>
                                                    {chat.link && (
                                                        <div className="relative">
                                                            <Image
                                                                src={chat.link.trim()}
                                                                alt="chart"
                                                                width={400}
                                                                height={400}
                                                            />
                                                            <button
                                                                onClick={() =>
                                                                    handleDownload(chat.link as string)
                                                                }
                                                                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg"
                                                            >
                                                                <Download size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                chat.content
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Input Field */}
            <form onSubmit={() => { }} className="border-t bg-background p-2">
                <div className="relative">
                    <Textarea
                        placeholder="Type your message..."
                        className="min-h-[48px] w-full rounded-2xl border border-neutral-400 p-4 pr-16 shadow-sm resize-none"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled
                    />
                    <Button type="submit" size="icon" className="absolute right-3 top-3" disabled>
                        <SendIcon className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
            </form>
        </div>

    );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
        </svg>
    );
}
