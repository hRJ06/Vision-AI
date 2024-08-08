"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";
import { useState } from "react";
import {
  loginOrganization,
  registerOrganization,
} from "@/lib/actions/organization.action";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { FORM_TYPE_SET } from "@/lib/utils";

export default function Component() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    lob: "",
    domain: "",
  });
  const [tabValue, setTabValue] = useState("Login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let response;
    if (FORM_TYPE_SET.has(tabValue)) {
      response = await loginOrganization(formData);
    } else {
      response = await registerOrganization(formData);
    }
    const parsedResponse = JSON.parse(response as string);
    if (parsedResponse.success) {
      toast({
        variant: "success",
        title: FORM_TYPE_SET.has(tabValue)
          ? "Login Successful"
          : "Registration Successful",
        description: FORM_TYPE_SET.has(tabValue)
          ? "Welcome back!"
          : "Thank you for registering with us.",
      });
      sessionStorage.setItem("token", parsedResponse.token);
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: parsedResponse.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Image
            src="/Logo.png"
            alt="Vision AI"
            width={48}
            height={48}
            className="mx-auto"
            style={{ aspectRatio: "48/48", objectFit: "cover" }}
            loading="lazy"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Welcome to Vision AI
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Get started with our powerful AI-powered vision tools.
          </p>
        </div>
        <Tabs
          defaultValue="Login"
          className="space-y-4"
          onValueChange={setTabValue}
        >
          <TabsList className="grid grid-cols-2 gap-2">
            <TabsTrigger value="Login">Login</TabsTrigger>
            <TabsTrigger value="Signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="Login">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="Signup">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lob">Line of Business</Label>
                <Select
                  name="lob"
                  value={formData.lob}
                  onValueChange={(value) =>
                    setFormData({ ...formData, lob: value })
                  }
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="accounting">Accounting</SelectItem>
                      <SelectItem value="investment-banking">
                        Investment Banking
                      </SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  type="text"
                  placeholder="Your domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign up
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
