"use client";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { loginUser, verifyUser } from "@/lib/actions/user.action";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

export default function Component() {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: e.target.value });
  };

  /* Handle otp change*/
  const handleOTPChange = (value: string, index: number) => {
    setFormData((prevData) => {
      const newOTP = prevData.otp.split("");
      newOTP[index] = value;
      return {
        ...prevData,
        otp: newOTP.join(""),
      };
    });
  };

  /* EMAIL HANDLER */
  const submitEmailHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await verifyUser({ email: formData.email });
    const parsedResponse = JSON.parse(response as string);

    if (parsedResponse) {
      toast({
        variant: "success",
        title: "OTP Sent",
        description: "Please check your email for the OTP.",
      });
      setTimeLeft(120);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send OTP.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  useEffect(() => {
    if (!timeLeft) return;
    if (timeLeft > 0) {
      const timerId = setInterval(
        () => setTimeLeft((prev) => (prev !== null ? prev - 1 : 0)),
        1000
      );
      return () => clearInterval(timerId);
    } else {
      setTimeLeft(null);
    }
  }, [timeLeft]);

  /* OTP HANDLER*/
  const submitOTPHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp) return;

    const response = await loginUser({
      email: formData.email,
      otp: formData.otp,
    });
    const parsedResponse = JSON.parse(response as string);

    if (parsedResponse.success) {
      toast({
        variant: "success",
        title: "Login Successful",
        description: "Let's Get Started!",
      });
      router.push("/");
    } else {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  /* TIME FORMATTER */
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
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
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="org@example.com"
              required
              value={formData.email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="otp">OTP</Label>
              <Button variant="link" size="sm" onClick={submitEmailHandler}>
                Generate OTP
              </Button>
            </div>
            <div className="w-full flex items-center justify-center">
              <InputOTP
                maxLength={4}
                pattern="^[0-9]+$"
                required
                value={formData.otp}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, otp: value }))
                }
              >
                <InputOTPGroup>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      value={formData.otp[index] || ""}
                      onChange={(value) => handleOTPChange(value, index)}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {timeLeft !== null && (
                <div className="text-muted-foreground justify-end ml-2">
                  Expires In: {formatTime(timeLeft)}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={submitOTPHandler}
            disabled={!timeLeft}
          >
            Sign In
          </Button>
        </CardFooter>
      </div>
    </div>
  );
}
