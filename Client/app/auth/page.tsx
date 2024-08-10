import Link from "next/link";
import { FaDatabase } from "react-icons/fa6";

export default function Component() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen relative">
      <Link
        href="/"
        prefetch={false}
        className="absolute top-0 left-0 mt-4 ml-4 flex justify-start lg:mt-4 lg:ml-10"
      >
        <div>
          <div className="text-xl font-semibold flex items-center space-x-2">
            <FaDatabase />
            <h1 className="text-black text-lg">Vision AI</h1>
          </div>
        </div>
      </Link>

      <div className="flex flex-col items-center justify-center p-8 md:p-12 lg:p-16 w-full md:w-3/5 relative">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold">
            Welcome to Vision AI
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">
            Advancing Innovation through Intelligent Solutions
          </h2>
          <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
            Hey there, adventure awaits! Ready to dive into something amazing
            with us?
          </p>
        </div>

        <div className="flex flex-col gap-4 w-[50%]">
          <Link
            href="/auth/org"
            className="inline-flex h-12 items-center justify-center rounded-md dark:bg-[#0D1526] text-white bg-[#161616] px-8 text-lg font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            <BriefcaseIcon className="mr-2 h-4 w-4" />
            Org
          </Link>
          <Link
            href="/auth/dev"
            className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-lg font-medium shadow-sm transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            <CodeIcon className="mr-2 h-4 w-4" />
            Dev
          </Link>
        </div>
      </div>

      {/* second section */}
      <div className="w-full md:w-2/5 h-full dark:bg-[#0D1526] bg-[#161616]">
        {/* Empty black section */}
      </div>
    </div>
  );
}

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  );
}

function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
