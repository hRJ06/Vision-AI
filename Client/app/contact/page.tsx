"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AwardIcon, DatabaseIcon } from "lucide-react";
import { useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { sendEmail } from "@/lib/actions/mail.action";

export default function Component() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const emailHandler = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide all fields.",
      });
      return;
    }
    const response = await sendEmail(formData);
    if (response) {
      toast({
        variant: "success",
        title: "Connection Successful",
        description: "Thank You for connecting with us.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please try again.",
      });
    }
  };
  return (
    <div className="flex flex-col min-h-dvh">
      <section className="w-full py-12 md:py-24 lg:py-32 border-b">
        <div className="container px-4 md:px-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 md:gap-20">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Connect. Analyze. Visualize.
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Connect to your internal databases, generate ER diagrams,
                analyze database structures, and leverage NLP-powered processing
                with our cutting-edge AI models.
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPinIcon className="mt-1 text-primary" />
                  <div>
                    <p className="font-medium">Office Address</p>
                    <p className="text-muted-foreground">
                      123 Main Street, Anytown USA 12345
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <PhoneIcon className="mt-1 text-primary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+1 (555) 555-5555</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MailIcon className="mt-1 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">info@visionai.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center">
        <div className="container px-4 md:px-6 grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Get in Touch
            </h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message"
                  className="min-h-[150px]"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="w-full" onClick={emailHandler}>
                Send Message
              </Button>
            </form>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Our Expertise
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                With years of experience in AI and data analysis, our team is
                equipped to tackle your toughest challenges.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <AwardIcon className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-lg font-bold">Industry Awards</h3>
                  <p className="text-muted-foreground">
                    Recognized for our innovative solutions and exceptional
                    service.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <DatabaseIcon className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-lg font-bold">Database Expertise</h3>
                  <p className="text-muted-foreground">
                    Our team has deep knowledge of database technologies and
                    best practices.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <XIcon className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-lg font-bold">AI-powered Solutions</h3>
                  <p className="text-muted-foreground">
                    Leverage the latest advancements in AI and machine learning
                    to drive your business forward.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-muted py-4 text-center text-sm text-muted-foreground">
        <div className="container">
          &copy; 2024 Vision AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function MailIcon(props) {
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function MapPinIcon(props) {
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon(props) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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
