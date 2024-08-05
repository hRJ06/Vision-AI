"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { FormEvent } from "react";

export default function Component() {
  const { toast } = useToast();

  const bookingHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      variant: "success",
      title: "Booking Successful",
      description: "Thank you for connecting with us.",
    });
  };

  return (
    <div className="flex flex-col min-h-[100vh] w-full">
      <section className="w-full pt-12 md:pt-24 lg:pt-32">
        <div className="container space-y-10 xl:space-y-16">
          <div className="grid gap-4 px-4 md:grid-cols-2 md:gap-16">
            <div>
              <Image
                src="/Demo.gif"
                width={550}
                height={550}
                alt="Book"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
              />
            </div>
            <div className="flex flex-col items-start space-y-4">
              <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                Book a Demo Today
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Experience our powerful platform and see how it can transform
                your business. Book a demo with one of our experts today.
              </p>
              <Link
                href="#book"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Powerful Features to Boost Your Business
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers a wide range of features to help you
                  streamline your operations and drive growth.
                </p>
              </div>
              <ul className="grid gap-4">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">
                    Real-time Analytics
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">
                    Automated Workflows
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">
                    Customizable Integrations
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">
                    Secure Data Management
                  </span>
                </li>
              </ul>
            </div>
            <Image
              src="/KeyFeature.gif"
              width={550}
              height={310}
              alt="Features"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted" id="book">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Experience the Power of Our Platform
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Book a demo today and see how our platform can transform your
              business.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <form className="flex gap-2" onSubmit={bookingHandler}>
              <Input
                type="email"
                placeholder="Enter your email"
                className="max-w-lg flex-1"
                required
              />
              <Button type="submit">Book a Demo</Button>
            </form>
            <p className="text-xs text-muted-foreground">
              By submitting this form, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-2"
                prefetch={false}
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
