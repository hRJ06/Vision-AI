"use client"
import React, { useRef, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

export default function Component() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
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
          console.log('File uploaded successfully');
        } else {
          console.error('File upload failed');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
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
              <p className="font-medium">Chat CSV</p>
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
            <div className="flex items-start gap-4">
              <Avatar className="shrink-0">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="grid gap-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="font-medium">Acme Inc</div>
                  <div className="text-xs text-muted-foreground">2:39pm</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p>Hey, Upload your file to get started !</p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Avatar className="shrink-0">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
              <div className="grid gap-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="font-medium">You</div>
                  <div className="text-xs text-muted-foreground">2:41pm</div>
                </div>
                <div className="bg-primary rounded-lg p-3 text-primary-foreground">
                  <p>Sure, what issues did you notice?</p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Avatar className="shrink-0">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="grid gap-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="font-medium">Acme Inc</div>
                  <div className="text-xs text-muted-foreground">2:42pm</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p>The sales numbers in the "Revenue" column seem off. Can you double-check those?</p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Avatar className="shrink-0">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
              <div className="grid gap-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="font-medium">You</div>
                  <div className="text-xs text-muted-foreground">2:43pm</div>
                </div>
                <div className="bg-primary rounded-lg p-3 text-primary-foreground">
                  <p>Got it, I'll take a look and get back to you.</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="sticky bottom-0 bg-background border-t p-4">
          <div className="relative">
            <Textarea placeholder="Type your message..." className="pr-16 min-h-[48px] rounded-2xl resize-none" />
            <Button type="submit" size="icon" className="absolute w-8 h-8 top-3 right-3">
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
