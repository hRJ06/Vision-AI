import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <nav className="lg:ml-auto flex gap-4 sm:gap-6 justify-center items-center lg:w-auto w-full ">
          <ThemeSwitcher/>
          <Link
            href="#features"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href="/faq"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            FAQ
          </Link>
          <Link
            href="#about"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Unlock the Power of Your Data with Vision AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Connect to your internal databases, generate ER diagrams,
                    analyze database structures, and leverage NLP-powered
                    processing with our cutting-edge AI models.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row lg:m-0 mx-auto w-full lg:justify-start justify-center">
                  <Link
                    href="/c"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-bold tracking-wide text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/features"
                    className="inline-flex h-10 items-center text-blue-600 justify-center rounded-md border border-input bg-background tracking-wide font-extrabold px-8 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Explore Feature
                  </Link>
                </div>
              </div>
              <Image
                src="/Hero.gif"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2" id="features">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Unlock the Power of Your Data
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Vision AI provides a comprehensive suite of tools to help you
                  connect, analyze, and process your data like never before.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Connect to Databases
                      </h3>
                      <p className="text-muted-foreground">
                        Easily connect to your internal databases and leverage
                        our powerful AI models to analyze and process your data.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Generate ER Diagrams
                      </h3>
                      <p className="text-muted-foreground">
                        Automatically generate detailed ER diagrams from your
                        database schema, making it easy to visualize and
                        understand your data structure.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Analyze Database Structure
                      </h3>
                      <p className="text-muted-foreground">
                        Leverage our advanced AI models to analyze your database
                        structure, identify potential issues, and suggest
                        optimizations.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        NLP-powered Processing
                      </h3>
                      <p className="text-muted-foreground">
                        Utilize our cutting-edge natural language processing
                        (NLP) capabilities to extract insights and perform
                        advanced data processing tasks.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <Image
                src="/Feature.gif"
                width="300"
                height="800"
                alt="Image"
                className="mx-auto h-full rounded-xl object-cover aspect-video object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32" id="about">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Trusted by Leading Organizations
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Vision AI has been helping businesses of all sizes unlock the
                power of their data. See what our customers have to say.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end justify-center">
              <Link
                href="#partners"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-base tracking-wide font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                View Case Studies
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-base tracking-wide font-bold transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted" id="partners">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                What Our Customers Say
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from the businesses that have transformed their data with
                Vision AI.
              </p>
            </div>
            <div className="divide-y rounded-lg border">
              <div className="grid w-full lg:grid-cols-3 grid-cols-1 items-stretch justify-center divide-x md:grid-cols-3">
                <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                  <Card className="w-full">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                      <Avatar>
                        <AvatarImage src="https://avatar.iran.liara.run/public/92" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="mt-4 space-y-1">
                        <h4 className="text-lg font-semibold">Smriti Mandana</h4>
                        <p className="text-muted-foreground">CEO, Acme Inc.</p>
                      </div>
                      <p className="mt-4 text-muted-foreground">
                        "Vision AI has been a game-changer for our business. The
                        ability to connect to our databases, generate ER
                        diagrams, and leverage the NLP-powered processing has
                        unlocked new insights and opportunities."
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                  <Card className="w-full">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                      <Avatar>
                        <AvatarImage src="https://img.freepik.com/premium-vector/adult-male-character-smiling-portrait-rounded-avatar-photo-profile-media-cv-cheerful-man-middle-age-confident-personage-brunette-with-blush-cheeks-vector-flat-style_87689-2387.jpg" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="mt-4 space-y-1">
                        <h4 className="text-lg font-semibold">Rahul Bose</h4>
                        <p className="text-muted-foreground">
                          CTO, Globex Corp.
                        </p>
                      </div>
                      <p className="mt-4 text-muted-foreground">
                        "We've been using Vision AI for over a year now, and
                        it's become an essential tool in our data analytics
                        workflow. The insights we've gained have helped us make
                        more informed decisions and drive our business forward."
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                  <Card className="w-full">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                      <Avatar>
                      <AvatarImage src="https://avatar.iran.liara.run/public/37" />
                        <AvatarFallback>Koushik Sen</AvatarFallback>
                      </Avatar>
                      <div className="mt-4 space-y-1">
                        <h4 className="text-lg font-semibold">
                          Michael Johnson
                        </h4>
                        <p className="text-muted-foreground">
                          Data Analyst, Stark Industries
                        </p>
                      </div>
                      <p className="mt-4 text-muted-foreground">
                        "Vision AI has streamlined our data analysis workflows
                        and helped us uncover insights that were previously
                        hidden. The NLP-powered processing has been a
                        game-changer for our team."
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 Vision AI. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/terms"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function EyeIcon(props:React.SVGProps<SVGSVGElement>) {
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function XIcon(props:React.SVGProps<SVGSVGElement>) {
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
