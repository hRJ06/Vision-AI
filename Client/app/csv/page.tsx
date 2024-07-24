"use client";
import React, { useRef, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';
import Link from 'next/link';


export default function Component() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "Vision",
      text: "Hey, Upload your file to get started !",
     
    },
  ]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleQuery = async () => {
    const data = { 'prompt': query };
    console.log(data);

    try {
    
      const response = await axios.post('http://localhost:5000/chatCSV', data);
      console.log(response)
      
       if (response.status === 200) {
        console.log('Query executed successfully');
        setMessages(prevMessages => [
          ...prevMessages,
          {
            sender: "You",
            text: query,
    
          },
          {
            sender: "Vision",
            text: response.data.response, 
           
          }
        ]);
        setQuery(""); 
      } else {
        console.error('Error running the query');
      }
    } catch (error) {
      console.error('Error Executing query:', error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5000/upload_csv', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          toast({
            variant: "success",
            title: "File Uploaded Successfully",
            description: "The connection was successful.",
            action: <ToastAction altText="File Uploaded">File uploaded!</ToastAction>,
          });
          console.log('File uploaded successfully');
        } else {
          console.error('File upload failed');
          toast({
            variant: "destructive",
            title: "File Upload Failed",
            description: "The connection was unsuccessful.",
            action: <ToastAction altText="File Upload Failed">File upload failed!</ToastAction>,
          });
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuery();
    }
  };

  return (
    <div className="grid md:grid-cols-[400px_1fr] min-h-screen w-full">
      <div className="flex flex-col bg-muted p-6 gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Upload a CSV file</h2>
          <p className="text-muted-foreground">Upload a CSV file to start chatting about its contents.</p>
        </div>
        <div
          className="flex items-center justify-center bg-background border-2 border-dashed border-input rounded-md p-12 cursor-pointer"
          onClick={handleUploadClick}
        >
          <div className="space-y-2 text-center">
            <div className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm font-medium">
              {fileName ? `Selected file: ${fileName}` : 'Drag and drop a file or click to upload'}
            </p>
            <p className="text-xs text-muted-foreground">Supported file types: CSV</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {file && (
          <Button onClick={handleFileUpload} className="mt-4">
            Upload File
          </Button>
        )}
      </div>
      <div className="flex flex-col">
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div>
             <Link className="font-medium" href="/" > Vision AI</Link>
          
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoveHorizontalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <DownloadIcon className="w-4 h-4 mr-2" />
                Download CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="grid gap-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-4 ${message.sender === "You" ? "justify-end" : ""}`}>
               <Avatar className="h-8 w-8 shrink-0 border">
                    <AvatarImage src={`${message.sender === "You" ? "https://w1.pngwing.com/pngs/743/500/png-transparent-circle-silhouette-logo-user-user-profile-green-facial-expression-nose-cartoon-thumbnail.png" : "https://img.freepik.com/free-vector/graident-ai-robot-vectorart_78370-4114.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1721433600&semt=sph"}`} />
                    <AvatarFallback>{message.sender}</AvatarFallback>
                  </Avatar>
                <div className="grid gap-1 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{message.sender}</div>
                    <div className="text-xs text-muted-foreground">{message.time}</div>
                  </div>
                  <div className={`bg-${message.sender === "You" ? "primary" : "muted"} rounded-lg p-3 ${message.sender === "You" ? "text-primary-foreground" : ""}`}>
                    <p>{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="sticky bottom-0 bg-background border-t p-4">
          <div className="relative">
            <Textarea
              placeholder="Type your message..."
              className="pr-16 min-h-[48px] rounded-2xl resize-none"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              value={query}
            />
            <Button type="submit" size="icon" className="absolute w-8 h-8 top-3 right-3" onClick={handleQuery}>
              <ArrowUpIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


  function ArrowUpIcon(props) {
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
        <path d="m5 12 7-7 7 7" />
        <path d="M12 19V5" />
      </svg>
    );
  }

  function DownloadIcon(props) {
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
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
    );
  }

  function MoveHorizontalIcon(props) {
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
        <polyline points="18 8 22 12 18 16" />
        <polyline points="6 8 2 12 6 16" />
        <line x1="2" x2="22" y1="12" y2="12" />
      </svg>
    );
  }

  function TrashIcon(props) {
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
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </svg>
    );
  }
