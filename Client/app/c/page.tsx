"use client";
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
import { ChatMessage, DatabaseCredentials } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Image from "next/image";

export default function Component() {
  const { toast } = useToast();
  const [databaseCredentials, setDatabaseCredentials] =
    useState<DatabaseCredentials | null>(null);
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

  /* GEMINI CONFIG */
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
  const genAI = new GoogleGenerativeAI(`${API_KEY}`);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const [welcome, setwelcome] = useState<Boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const [chats, setchats] = useState<ChatMessage[]>([
    {
      msg: "Hi there! How can i help You today?",
      role: "AI",
    },
  ]);

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

  const formatMessage = (message: string) => {
    return message.split("\n").map((part, index) => {
      const isList = /^\d+\./.test(part.trim());

      const formattedPart = part
        .split(/(\*\*.*?\*\*)/g)
        .map((subPart, subIndex) => {
          if (subPart.startsWith("**") && subPart.endsWith("**")) {
            return <b key={subIndex}>{subPart.slice(2, -2)}</b>;
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
      const response = await axios.post("http://127.0.0.1:5000/connect", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.status === "success") {
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

  const containsLink = (text: string) => {
    const urlPattern =
      /https?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/;
    return urlPattern.test(text);
  };

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (databaseCredentials === null) {
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
      setchats([...chats, { msg: inputText, role: "User" }]);
      const userPrompt = inputText;
      setInputText("");
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/chat",
          { ...databaseCredentials, message: userPrompt },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const llm_response = response.data.response;
        const prompt = `You are senior data analyst. I will give you a prompt which will basically be the response of a sql query. If you feel that it can be represented in any kind of chart like bar, pie(for textual data) and many more, you need to return me a quickchart link for it using the data from my prompt and just send me the link nothing else. If suppose the prompt does not have enough data to generate a graph then just return me not possible. The prompt is given by another llm model. So the prompt is ${llm_response}`;
        const result = await model.generateContent(prompt);
        const quickchart_response = await result.response.text();
        const hasLink = containsLink(quickchart_response);

        setchats((prevChats) => [
          ...prevChats,
          {
            msg: response.data.response,
            role: "AI",
            link: hasLink ? quickchart_response : null,
          },
        ]);
      } catch (error) {
        console.error("Error", error);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col md:grid md:grid-cols-[280px_1fr]">
      <div className="flex flex-col border-r bg-muted/40 p-4 md:border-r">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold ml-2">AI Assistant</h2>
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
          *Make sure you are authorized as we store logs.
        </div>
      </div>

      {/* WELCOME CHAT */}

      <div className="flex flex-col">
        <div className="sticky top-0 z-10 border-b bg-background/50 p-4 backdrop-blur-md">
          <h1 className="text-xl lg:text-left text-center font-semibold">
            Vision AI{" "}
          </h1>
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
                  onClick={() => setwelcome(true)}
                >
                  Get Started
                </Button>
                <Link href="/faq">
                  <Button
                    variant="outline"
                    className="text-black hover:bg-black hover:text-white font-bold py-3 px-6 text-lg"
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
            {" "}
            {/* Adjust height as needed */}
            <div className="flex flex-col gap-4">
              {chats.map((chat, index) => (
                <div key={index} className={`flex items-start gap-4 ${chat.role === "AI" ?  "":"justify-end"} `}>
                  <Avatar className="h-8 w-8 shrink-0 border">
                    <AvatarImage
                      src={`${chat.role === "User"
                          ? "https://w1.pngwing.com/pngs/743/500/png-transparent-circle-silhouette-logo-user-user-profile-green-facial-expression-nose-cartoon-thumbnail.png"
                          : "https://img.freepik.com/free-vector/graident-ai-robot-vectorart_78370-4114.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1721433600&semt=sph"
                        }`}
                    />
                    <AvatarFallback>{chat.role}</AvatarFallback>
                  </Avatar>
                  <div className="max-w-[700px]">
                    {" "}
                    {/* Fixed width for message box */}
                    <div className="grid gap-1">
                      <div className={`prose text-muted-foreground  bg-${chat.role === "AI" ? "muted":"primary" }  p-2 rounded-md ${chat.role === "User" ? "text-primary-foreground" : ""}`}>
                        {chat.role === "AI" ? (
                          <>
                            <p>{formatMessage(chat.msg)}</p>
                            {chat.link && (
                              <Image
                                src={chat.link}
                                alt="chart"
                                width={400}
                                height={400}
                              />
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
          <div className="sticky bottom-0 z-10 border-t bg-background/50 p-4 backdrop-blur-md">
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
                onClick={(e) => handleSendMessage(e)}
              >
                <SendIcon className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>

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

function MicIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
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

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
