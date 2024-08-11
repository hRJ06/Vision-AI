"use client";
export const fetchCache = "force-no-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { CachedResponse, ChatMessage, DatabaseCredentials } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosResponse } from "axios";
import { FormEvent, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineEdit } from "react-icons/ai";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DownloadIcon, EllipsisVertical, Download } from "lucide-react";
import { cache, checkKey } from "@/lib/actions/redis.action";
import {
  AI_MESSAGE_ROLE_SET,
  containsLink,
  generate_database_visualisation_prompt,
  getModel,
  INVALID_RESPONSE_SET,
} from "@/lib/utils";
import cookie from "js-cookie";
import { addMessage, createChat } from "@/lib/actions/chat.action";
import { Loader } from "lucide-react";

export default function Component() {
  const { toast } = useToast();

  const [databaseCredentials, setDatabaseCredentials] =
    useState<DatabaseCredentials | null>(null);
  const [schemaInfo, setSchemaInfo] = useState<string>("");
  const [welcome, setWelcome] = useState<Boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const [chatID, setChatID] = useState<string>("");

  const [chats, setChats] = useState<ChatMessage[]>([
    {
      msg: "Hi there! How can I help You today?",
      role: "AI",
    },
  ]);

  /* FORM SCHEMA INITIALIZATION */
  const formSchema = z.object({
    Host: z.string().min(2, {
      message: "Hostname must be at least 2 characters.",
    }),
    Port: z.string().regex(/^\d+$/, {
      message: "Port must be a valid number.",
    }),
    Database: z.string().min(2, {
      message: "Database name must be at least 2 characters.",
    }),
    User: z.string().min(2, {
      message: "User must be at least 2 characters.",
    }),
    Password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  });

  /* ZOD FORM */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Host: "",
      Port: "",
      Database: "",
      User: "",
      Password: "",
    },
  });

  /* GEMINI */
  const model = getModel();

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

  /* DOWNLOAD HANDLER FOR DB REPORT */
  const downloadHandler = useCallback(async () => {
    const details = { ...databaseCredentials, schemaDescription: schemaInfo };
    try {
      const response: AxiosResponse<Blob> = await axios.post(
        "http://localhost:4000/image/report",
        details,
        {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
    }
  }, [databaseCredentials, schemaInfo]);

  /* DB CONNECTION HANDLER */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = {
      Host: values.Host,
      Port: values.Port,
      Database: values.Database,
      User: values.User,
      Password: values.Password,
    };
    setDatabaseCredentials(data);

    try {
      const response = await axios.post("https://bb26-103-161-223-11.ngrok-free.app/connect", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.status === "success") {
        const schema_description = response.data.schema_description;
        const db = response.data.db;
        setSchemaInfo(schema_description);
        cookie.set("db", db, { secure: true });
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
  };

  /*ADD MESSAGE */
  const addNewMessage = async (chat: ChatMessage) => {
    if (!chatID) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }
    try {
      const response = JSON.parse(await addMessage({ ...chat, id: chatID }));
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
        title: "Uh oh! Something went wrong.",
        description: error.message || "An unexpected error occurred.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  /* CHAT MESSAGE HANDLER */
  const handleSendMessage = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const db_uri = cookie.get("db");
    if (!db_uri) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide database credentials first",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setInputText("");
      return;
    }
    if (inputText.trim()) {
      const userPrompt = inputText;
      const userChat: ChatMessage = { msg: userPrompt, role: "User" };
      setChats((prevChats) => [...prevChats, userChat]);
      addNewMessage(userChat);
      setInputText("");
      try {
        const cachedResponse: CachedResponse = await checkKey(
          db_uri,
          userPrompt
        );
        let newChat: ChatMessage = { msg: "", role: "User" };
        if (INVALID_RESPONSE_SET.has(cachedResponse)) {
          const response = await axios.post(
            "https://bb26-103-161-223-11.ngrok-free.app/chat",
            { message: userPrompt, db: db_uri },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const llmResponse = response.data.response;
          const prompt = generate_database_visualisation_prompt(llmResponse);
          const result = await model.generateContent(prompt);
          const quickchartResponse = result.response.text();
          const hasLink = containsLink(quickchartResponse);
          newChat = {
            msg: response.data.response,
            role: "AI",
            link: hasLink ? quickchartResponse : null,
          };
          await cache(db_uri, userPrompt, newChat);
        } else {
          newChat = cachedResponse;
        }
        setChats((prevChats) => [...prevChats, newChat]);
        addNewMessage(newChat);
      } catch (error) {
        console.error(error);
      }
    }
  };

  /* CREATE CHAT */
  const createChatHandler = async () => {
    try {
      const response = await createChat(name);
      const parsedResponse = JSON.parse(response as string);
      if (parsedResponse.success) {
        setChatID(parsedResponse.chat._id);
        toast({
          variant: "success",
          title: "Chat Created",
          description: "Let's Get Started!",
        });
        setWelcome(true);
        setIsOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: parsedResponse.message,
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


  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col md:grid md:grid-cols-[280px_1fr]">
      <div className="flex flex-col border-r bg-muted/40 p-4 md:border-r">
        <div className="flex items-center justify-between">
          <Link href="/" prefetch={false}>
            <h1 className="text-xl lg:text-left text-center font-semibold">
              Vision AI{" "}
            </h1>
          </Link>
        </div>

        {/* DB CONNECT */}
        <div className="mt-4 flex-1 space-y-4 overflow-auto">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground ml-2">
              Database Credentials
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 mt-2 p-1"
              >
                <FormField
                  control={form.control}
                  name="Host"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="hostname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Port"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="port" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Database"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="database" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="User"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="user" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="password"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full flex justify-center">
                  <Button type="submit" className="w-full">
                    Connect
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <div className="mt-4 text-sm text-red-600 text-justify">
          *Make sure you are authorized, as we store logs.
        </div>
      </div>

      {/* WELCOME CHAT */}
      <div className="flex flex-col">
        <div className="sticky top-0 z-10 border-b bg-background/50 p-4 backdrop-blur-md flex justify-between items-baseline">
          <h1 className="text-xl lg:text-left text-center font-semibold">
            {name}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <EllipsisVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={downloadHandler}>
                <DownloadIcon className="w-4 h-4 mr-2" />
                Download Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {chats.length < 2 && !welcome && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-5xl font-bold">Welcome to Vision AI</h1>
                <h2 className="text-3xl font-semibold">
                  Pioneering the Future of Intelligent Solutions
                </h2>
                <p className="text-muted-foreground">
                  Start a conversation by connecting to a chat server.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  className="bg-black text-white py-3 px-6 text-lg font-semibold"
                  onClick={() => setIsOpen(true)}
                >
                  Get Started
                </Button>
                <Link href="/faq">
                  <Button
                    variant="outline"
                    className="text-black hover:bg-black dark:text-white hover:text-white font-bold py-3 px-6 text-lg"
                  >
                    FAQ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Chats */}
        {welcome && (
          <div className="flex-1 overflow-auto p-4 max-h-[calc(100vh-10rem)]">
            <div className="flex flex-col gap-4">
              {chats.map((chat, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 ${
                    AI_MESSAGE_ROLE_SET.has(chat.role) ? "" : "justify-end"
                  } `}
                >
                  <Avatar className="h-8 w-8 shrink-0 border">
                    <AvatarImage
                      src={`${
                        AI_MESSAGE_ROLE_SET.has(chat.role)
                          ? "/AI.png"
                          : "/Human.png"
                      }`}
                    />
                    <AvatarFallback>{chat.role}</AvatarFallback>
                  </Avatar>
                  <div className="max-w-[700px]">
                    <div className="grid gap-1">
                      <div
                        className={`prose text-muted-foreground  bg-${
                          AI_MESSAGE_ROLE_SET.has(chat.role)
                            ? "muted"
                            : "primary"
                        }  p-2 rounded-md ${
                          AI_MESSAGE_ROLE_SET.has(chat.role)
                            ? ""
                            : "text-primary-foreground"
                        }`}
                      >
                        {AI_MESSAGE_ROLE_SET.has(chat.role) ? (
                          <>
                            <p>{formatMessage(chat.msg)}</p>
                            {chat.link && (
                              <div className="relative">
                                <Image
                                  src={chat.link}
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
                          chat.msg
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {welcome && (
          <form
            onSubmit={handleSendMessage}
            className="sticky bottom-0 z-10 border-t bg-background p-2 mt-40"
          >
            <div className="relative">
              <Textarea
                placeholder="Type your message..."
                className="min-h-[48px] w-full rounded-2xl border border-neutral-400 p-4 pr-16 shadow-sm resize-none"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-3 top-3"
              >
                <SendIcon className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* MODAL */}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xs sm:max-w-md sm:px-10 mx-auto">
          <DialogHeader>
            <DialogTitle>Name</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 w-full">
              <Input
                id="name"
                className="flex-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <AiOutlineEdit
                className="text-gray-500 cursor-pointer"
                size={30}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={createChatHandler}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
