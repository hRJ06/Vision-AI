
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"

export default function Component() {
    return (
        <div className="w-full">
        <section className="w-full py-8 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Unleash the Power of Vision AI</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Unlock a world of possibilities with our cutting-edge Vision AI features. Seamlessly integrate, analyze,
                  and transform your data like never before.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-8 md:py-16 lg:py-20 bg-muted">
          <div className="container grid grid-cols-1 gap-6 px-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:gap-10">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                    <DatabaseIcon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Connect to your internal databases</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Seamlessly integrate Vision AI with your existing databases to unlock powerful insights and automation.
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href="/c"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  <ArrowRightIcon className="mr-2 h-4 w-4" />
                  Explore
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                    <MapIcon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Generate ER diagrams</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Automatically generate comprehensive ER diagrams from your database structures, making it easy to
                  visualize and understand your data.
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href="/er/generate"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  <ArrowRightIcon className="mr-2 h-4 w-4" />
                  Explore
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                    <ScanIcon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Analyze database structures</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gain deep insights into your database structures, including table relationships, data types, and more,
                  to optimize your data management.
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href="/er/analysis"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  <ArrowRightIcon className="mr-2 h-4 w-4" />
                  Explore
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                    <BotIcon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Leverage NLP-powered processing</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Harness the power of cutting-edge AI models to process and extract insights from your data, taking your
                  analysis to new heights.
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href="/c"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  <ArrowRightIcon className="mr-2 h-4 w-4" />
                  Explore
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
        <footer className="w-full bg-muted py-6 px-4 md:px-6">
          <div className="container flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">&copy; 2024 Acme Inc. All rights reserved.</p>
            <Link
              href="/contact"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              <ArrowRightIcon className="mr-2 h-4 w-4" />
              Contact Us
            </Link>
          </div>
        </footer>
      </div>
      
    )
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
    )
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
    )
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
    )
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
    )
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
    )
}


function XIcon(props: React.SVGProps<SVGSVGElement>) {
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
    )
}