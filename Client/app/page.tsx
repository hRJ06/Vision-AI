"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { ToastAction } from "@/components/ui/toast";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Component() {
  const { toast } = useToast();
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
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Construct a plain JavaScript object from form values
    const data = {
      Host: values.Host,
      Port: values.Port,
      Database: values.Database,
      User: values.User,
      Password: values.Password,
    };

    try {
      // Make a POST request with JSON data
      const response = await axios.post("http://127.0.0.1:5000/connect", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      // Handle the response
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
  return (
    <div className="grid min-h-screen w-full grid-cols-[280px_1fr] bg-background text-foreground">
      <div className="flex flex-col border-r bg-muted/40 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">AI Assistant</h2>
          <Button variant="ghost" size="icon">
            <SettingsIcon className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
        <div className="mt-4 flex-1 space-y-4 overflow-auto">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
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
          <Tabs defaultValue="database">
            <TabsList className="ml">
              <TabsTrigger value="csv">CSV</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
            </TabsList>
            <TabsContent value="csv">
              <div className="space-y-4">
                <Button variant="outline" size="sm">
                  <FileIcon className="mr-2 h-4 w-4" />
                  Attach File
                </Button>
                <Button variant="outline" size="sm">
                  <MicIcon className="mr-2 h-4 w-4" />
                  Send Voice
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="database">
              <div className="space-y-4">
                <Button variant="outline" size="sm">
                  <MicIcon className="mr-2 h-4 w-4" />
                  Send Voice
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="sticky top-0 z-10 border-b bg-background/50 p-4 backdrop-blur-md">
          <h1 className="text-xl font-semibold">AI-Powered Chat</h1>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-8 w-8 shrink-0 border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-medium">You</div>
                <div className="prose text-muted-foreground">
                  <p>
                    Hi there! I'd like to analyze some data from a CSV file and
                    a database. Can you help me with that?
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Avatar className="h-8 w-8 shrink-0 border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>OA</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-medium">AI Assistant</div>
                <div className="prose text-muted-foreground">
                  <p>
                    Absolutely! I'd be happy to help you with that. First,
                    please provide the database credentials in the sidebar so I
                    can connect to the database. Once that's set up, we can
                    start analyzing the data from both the CSV file and the
                    database.
                  </p>
                  <p>
                    You can also use the attachment and voice message options in
                    the sidebar to provide the CSV file or any other relevant
                    files.
                  </p>
                  <Button variant="ghost" size="icon" className="ml-auto">
                    <VolumeIcon className="h-5 w-5" />
                    <span className="sr-only">Speak</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Avatar className="h-8 w-8 shrink-0 border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-medium">You</div>
                <div className="prose text-muted-foreground">
                  <p>
                    Great, let me get those database credentials set up. I'll
                    also upload the CSV file shortly. Looking forward to
                    analyzing the data together!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Avatar className="h-8 w-8 shrink-0 border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>OA</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-medium">AI Assistant</div>
                <div className="prose text-muted-foreground">
                  <p>
                    Sounds good! I'll be here waiting for the database
                    credentials and the CSV file. Once we have those, we can
                    dive right into the data analysis.
                  </p>
                  <Button variant="ghost" size="icon" className="ml-auto">
                    <VolumeIcon className="h-5 w-5" />
                    <span className="sr-only">Speak</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 z-10 border-t bg-background/50 p-4 backdrop-blur-md">
          <div className="relative">
            <Textarea
              placeholder="Type your message..."
              className="min-h-[48px] w-full rounded-2xl border border-neutral-400 p-4 pr-16 shadow-sm resize-none"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-3 top-3"
            >
              <SendIcon className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
            <div className="absolute right-12 top-3">
              <Button variant="ghost" size="icon">
                <FileIcon className="h-4 w-4" />
                <span className="sr-only">Attach File</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileIcon(props: any) {
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

function MicIcon(props: any) {
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

function SendIcon(props: any) {
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

function SettingsIcon(props: any) {
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

function VolumeIcon(props: any) {
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
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    </svg>
  );
}

function XIcon(props: any) {
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
