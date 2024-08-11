"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FaLessThan } from "react-icons/fa6";

export default function Component() {
  const cards = [
    {
      id: 1,
      icon: <DatabaseIcon className="w-6 h-6 text-primary-foreground" />,
      title: "Connect to your internal databases",
      description:
        "Seamlessly integrate Vision AI with your existing databases to unlock powerful insights and automation.",
      link: "/c",
    },
    {
      id: 2,
      icon: <MapIcon className="w-6 h-6 text-primary-foreground" />,
      title: "Generate ER diagrams",
      description:
        "Automatically generate comprehensive ER diagrams from your database structures, making it easy to visualize and understand your data.",
      link: "/er/generate",
    },
    {
      id: 3,
      icon: <ScanIcon className="w-6 h-6 text-primary-foreground" />,
      title: "Analyze database structures",
      description:
        "Gain deep insights into your database structures, including table relationships, data types, and more, to optimize your data management.",
      link: "/er/analysis",
    },
    {
      id: 4,
      icon: <BotIcon className="w-6 h-6 text-primary-foreground" />,
      title: "Leverage NLP-powered processing",
      description:
        "Harness the power of cutting-edge AI models to process and extract insights from your data, taking your analysis to new heights.",
      link: "/csv",
    },
    {
      id: 5,
      icon: <GraphIcon className="w-6 h-6 text-primary-foreground" />,
      title: "Visualize Your DB",
      description:
        "Visualize your database structures with advanced tools, simplifying data analysis and management to achieve greater efficiency.",
      link: "/visualisation",
    },
  ];

  const [visibleCards, setVisibleCards] = useState(0);

  const handleNext = () => {
    setVisibleCards((prev) => (prev < cards.length - 4 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setVisibleCards((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="w-full">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Unleash the Power of Vision AI
              </h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Unlock a world of possibilities with our cutting-edge Vision AI
                features. Seamlessly integrate, analyze, and transform your data
                like never before.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container grid grid-cols-1 gap-6 px-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:gap-10">
          {cards.slice(visibleCards, visibleCards + 4).map((card) => (
            <Card key={card.id}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{card.description}</p>
              </CardContent>
              <CardFooter>
                <Link
                  href={card.link}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  <ArrowRightIcon className="mr-2 h-4 w-4" />
                  Explore
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={handlePrev}
            className="mr-4 h-9 w-9 rounded-full bg-primary text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 flex items-center justify-center"
            disabled={!visibleCards}
          >
            <FaLessThan />
          </button>
          <button
            onClick={handleNext}
            className="h-9 w-9 rounded-full bg-primary text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 flex items-center justify-center"
            disabled={visibleCards != cards.length - 4 ? false : true}
          >
            <FaLessThan className="transform rotate-180" />
          </button>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Unlock Powerful Insights
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our Vision AI platform empowers you to uncover hidden patterns,
                trends, and opportunities within your data. Gain a competitive
                edge by leveraging advanced analytics and machine learning.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                <Link
                  href="/c"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  <ArrowRightIcon className="mr-2 h-4 w-4" />
                  Get Started
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Request a Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container grid grid-cols-1 gap-6 px-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="bg-primary rounded-md p-4 flex items-center justify-center">
              <GaugeIcon className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Unparalleled Performance</h3>
            <p className="text-muted-foreground">
              Our Vision AI platform is designed for lightning-fast processing
              and analysis, ensuring you get results in record time.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="bg-primary rounded-md p-4 flex items-center justify-center">
              <ShieldIcon className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Enterprise-Grade Security</h3>
            <p className="text-muted-foreground">
              Rest assured that your data is safe and secure with our robust
              security measures and compliance standards.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="bg-primary rounded-md p-4 flex items-center justify-center">
              <LayersIcon className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Scalable and Flexible</h3>
            <p className="text-muted-foreground">
              Our platform is designed to grow with your business, seamlessly
              scaling to handle your increasing data and processing needs.
            </p>
          </div>
        </div>
      </section>
      <footer className="w-full bg-muted py-6 px-4 md:px-6">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; 2024 Vision AI. All rights reserved.
          </p>
          <Link
            href="/contact"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-32"
            prefetch={false}
          >
            <ArrowRightIcon className="mr-2 h-4 w-4" />
            Contact Us
          </Link>
        </div>
      </footer>
    </div>
  );
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function BotIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

function DatabaseIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

function GaugeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
}

function LayersIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  );
}

function MapIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
      <path d="M15 5.764v15" />
      <path d="M9 3.236v15" />
    </svg>
  );
}

function ScanIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    </svg>
  );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}
function GraphIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M4 12v8a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1zM10 8v12a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1zM16 4v16a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1z" />
    </svg>
  );
}
