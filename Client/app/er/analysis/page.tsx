"use client";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

export default function Component() {
    const [loading, setLoading] = useState<Boolean>(false);
    const [copied, setcopied] = useState<Boolean>(false);
    const [responses, setResponses] = useState<string>("");
    const [formattedResponses, setFormattedResponses] = useState<JSX.Element[]>(
        []
    );
    const [imageUrl, setImageURL] = useState<string>("");
    const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    /* IMAGE TO SQL */
    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const formData = new FormData();
                formData.append("image", file);
                setLoading(true);
                const response = await axios.post(
                    `${BASE_URL}/image/image-analysis`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                const fetchedImageURL = response?.data?.imageUrl;
                setImageURL(fetchedImageURL);
                setLoading(false);
                setResponses(response?.data?.generatedContent);
            };
            reader.readAsDataURL(file);
        }
    };

    /* QUERY MODIFICATON */
    useEffect(() => {
        if (responses) {
            const formatted = responses
                .replace(/```sql\n/, "")
                .replace(/```$/, "")
                .split("\n")
                .map((line: string, index: number) => <div key={index}>{line}</div>);

            setFormattedResponses(formatted);
        } else {
            setFormattedResponses([]);
        }
    }, [responses]);

    const handleCopy = () => {
        setcopied(true);
        navigator.clipboard.writeText(responses);
    };

    /* CHAT WITH IMAGE */
    const [userPrompt, setuserPrompt] = useState("");

    const [chats, setchats] = useState([
        {
            msg: "Hi there! How can i help You with the image you uploaded?",
            role: "AI",
        },
    ]);

    const handleImageChat = async (e: any) => {
        e.preventDefault();

        if (userPrompt.trim()) {
            setchats([...chats, { msg: userPrompt, role: "User" }]);

            try {
                const response = await axios.post(
                    `${BASE_URL}/image/chat`,
                    {
                        imageUrl: imageUrl,
                        userPrompt: userPrompt,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                setchats((prevChats) => [
                    ...prevChats,
                    { msg: response?.data?.generatedContent, role: "AI" },
                ]);
            } catch (error) {
                console.error("Error", error);
            }

            setuserPrompt("");
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 grid gap-8 p-4 md:p-8 lg:p-12">
                <div className="flex gap-4">
                    <div className="flex flex-col gap-4 w-1/3">
                        <Card className="flex-none h-40">
                            <CardHeader>
                                <CardTitle>Image Upload</CardTitle>
                                <CardDescription>
                                    Upload an image of <span className="text-red-500">* ER diagram</span> to get started
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!loading ? (
                                    <div className="grid gap-4 items-center">
                                        <div className="flex justify-center">
                                            <label
                                                htmlFor="image-upload"
                                                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                                            >
                                                <UploadIcon className="w-5 h-5 mr-2" />
                                                Upload Image
                                            </label>
                                            <input
                                                id="image-upload"
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={handleImage}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center w-full h-full">
                                        <Loader className="animate-spin h-6 w-6 text-primary" />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <Card className="flex-none h-[60vh] bg-gray-900 text-white flex flex-col">
                            <CardHeader>
                                <CardTitle>Query</CardTitle>
                                <CardDescription>
                                    This Query is based on the uploaded image
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 max-h-full overflow-y-auto">
                                <div className="grid gap-4 items-center">
                                    <div className="whitespace-pre-line">
                                        {formattedResponses}
                                    </div>
                                </div>
                            </CardContent>
                            {responses.length > 0 && (
                                <div className="flex justify-end p-4">
                                    <Button
                                        onClick={handleCopy}
                                        className="bg-gray-800 text-white hover:bg-gray-700"
                                    >
                                        <CopyIcon className="w-4 h-4 mr-2" />
                                        {copied ? "Copied" : "Copy"}
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>

                    <div className="flex flex-col w-2/3">
                        <Card className="flex-1">
                            <CardHeader>
                                <CardTitle>Image Output</CardTitle>
                                <CardDescription>
                                    This Chat is based on the Current uploaded image only.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="overflow-y-auto max-h-[65vh]">
                                {chats.map((chat, index) => (
                                    <div key={index} className={`flex items-start gap-4 mb-3`}>
                                        <Avatar className="h-8 w-8 shrink-0 border">
                                            <AvatarImage src="/placeholder-user.jpg" />
                                            <AvatarFallback>{chat.role}</AvatarFallback>
                                        </Avatar>
                                        <div className="max-w-[700px]">
                                            <div className="grid gap-1">
                                                <div className="prose text-gray-800 text-muted-foreground bg-gray-200 p-2 rounded-md">
                                                    <p>{chat.msg}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <div className="bg-background px-4 py-3 mt-2 md:px-8 lg:px-12">
                            <div className="relative">
                                <Textarea
                                    placeholder="Upload Image to start the conversation.."
                                    className="min-h-[48px] w-full rounded-2xl resize-none border border-neutral-400 bg-background p-4 pr-16 shadow-sm"
                                    value={userPrompt}
                                    onChange={(e) => setuserPrompt(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="absolute top-3 right-3 w-8 h-8"
                                    onClick={(e) => handleImageChat(e)}
                                >
                                    <ArrowUpIcon className="w-4 h-4" />
                                    <span className="sr-only">Send</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

    );
}

function ArrowUpIcon(props: React.SVGProps<SVGSVGElement>) {
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

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    );
}

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="M9 15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3" />
            <path d="M16 17h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-3" />
            <path d="M9 9l4-4 4 4" />
        </svg>
    );
}
