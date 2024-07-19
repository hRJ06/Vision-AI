import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Connect to your internal databases, generate ER diagrams, analyze
              them, and perform NLP-powered database processing using LLM models
              with Vision AI.
            </p>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8">
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-4 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold">
                  Connecting to Internal Databases
                </h3>
                <ChevronDownIcon className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 py-4 space-y-4">
                <div>
                  <h4 className="text-base font-semibold">
                    How do I connect my internal database to Vision AI?
                  </h4>
                  <p className="text-muted-foreground">
                    Vision AI provides a secure and easy-to-use interface to
                    connect your internal databases. Simply provide the
                    necessary connection details, and we'll handle the rest.
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-semibold">
                    What types of databases are supported?
                  </h4>
                  <p className="text-muted-foreground">
                    Vision AI supports a wide range of databases, including
                    MySQL, PostgreSQL, Oracle, SQL Server, and more. We're
                    constantly expanding our database support, so if you don't
                    see your database listed, please let us know.
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-semibold">
                    Is the connection secure and encrypted?
                  </h4>
                  <p className="text-muted-foreground">
                    Absolutely. We take security and privacy very seriously. All
                    connections to your internal databases are secured with
                    industry-standard encryption protocols to ensure the
                    confidentiality of your data.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-4 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold">
                  Generating ER Diagrams
                </h3>
                <ChevronDownIcon className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 py-4 space-y-4">
                <div>
                  <h4 className="text-base font-semibold">
                    Can Vision AI automatically generate ER diagrams from my
                    database schema?
                  </h4>
                  <p className="text-muted-foreground">
                    Yes, Vision AI can automatically generate ER diagrams from
                    your database schema. Our advanced algorithms analyze the
                    schema and create visually appealing and accurate ER
                    diagrams.
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-semibold">
                    How accurate are the generated ER diagrams?
                  </h4>
                  <p className="text-muted-foreground">
                    We strive for the highest accuracy in our ER diagram
                    generation. Our algorithms take into account all the
                    relevant metadata and relationships in your database to
                    produce ER diagrams that closely match your actual schema.
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-semibold">
                    Can I customize the ER diagram layout and styling?
                  </h4>
                  <p className="text-muted-foreground">
                    Absolutely. Vision AI provides a user-friendly interface
                    that allows you to customize the layout, colors, and other
                    visual aspects of the generated ER diagrams. You can
                    fine-tune the diagrams to match your preferences and
                    branding.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-4 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold">Analyzing ER Diagrams</h3>
                <ChevronDownIcon className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 py-4 space-y-4">
                <div>
                  <h4 className="text-base font-semibold">
                    What kind of analysis can Vision AI perform on my ER
                    diagrams?
                  </h4>
                  <p className="text-muted-foreground">
                    Vision AI's advanced analytics capabilities can identify
                    optimization opportunities, potential issues, and other
                    insights within your ER diagrams. We analyze factors like
                    table relationships, data types, and normalization to
                    provide actionable recommendations.
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-semibold">
                    Can it identify optimization opportunities or potential
                    issues?
                  </h4>
                  <p className="text-muted-foreground">
                    Yes, our analysis engine can detect optimization
                    opportunities, such as redundant or unnecessary
                    relationships, and potential issues like data integrity
                    problems or performance bottlenecks. We'll highlight these
                    findings to help you improve your database design.
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-semibold">
                    How are the analysis results presented?
                  </h4>
                  <p className="text-muted-foreground">
                    The analysis results are presented in a clear and intuitive
                    dashboard, with detailed reports and visualizations to help
                    you understand the insights. You can easily navigate through
                    the findings and take action to address any identified
                    issues or optimization opportunities.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-4 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold">
                  NLP-powered Database Processing
                </h3>
                <ChevronDownIcon className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 py-4 space-y-4">
                <div>
                  <h4 className="text-base font-semibold">
                    How does the LLM-based database processing work?
                  </h4>
                  <p className="text-muted-foreground">
                    Vision AI leverages advanced large language models (LLMs) to
                    enable natural language processing (NLP) capabilities for
                    your database. You can ask questions in plain English, and
                    our NLP engine will translate those queries into SQL,
                    retrieve the relevant data, and present the results.
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-semibold">
                    What kind of natural language queries are supported?
                  </h4>
                  <p className="text-muted-foreground">
                    Our NLP-powered database processing supports a wide range of
                    natural language queries, from simple data retrieval to
                    complex analytical questions. You can ask about specific
                    data points, generate reports, and even perform advanced
                    data manipulations, all without writing SQL.
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-semibold">
                    Can I integrate the NLP capabilities into my own
                    applications?
                  </h4>
                  <p className="text-muted-foreground">
                    Absolutely. Vision AI provides a comprehensive API that
                    allows you to seamlessly integrate our NLP-powered database
                    processing capabilities into your own applications. This
                    enables your users to interact with your data using natural
                    language, enhancing the overall user experience.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-4 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold">Pricing and Plans</h3>
                <ChevronDownIcon className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 py-4 space-y-4">
                <div>
                  <h4 className="text-base font-semibold">
                    What are the different pricing tiers for Vision AI?
                  </h4>
                  <p className="text-muted-foreground">
                    Vision AI offers a range of pricing tiers to suit the needs
                    of businesses of all sizes. We have a free plan for
                    small-scale usage, as well as several paid plans with
                    increasing capabilities and data limits. Our pricing is
                    transparent and based on the features and resources you
                    require.
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-semibold">
                    Are there any free or trial options available?
                  </h4>
                  <p className="text-muted-foreground">
                    Yes, we offer a free plan that allows you to explore the
                    core features of Vision AI, including database connections,
                    ER diagram generation, and basic analysis. We also provide a
                    free trial period for our paid plans, so you can test the
                    full capabilities before committing to a subscription.
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-semibold">
                    How can I upgrade or downgrade my plan?
                  </h4>
                  <p className="text-muted-foreground">
                    Upgrading or downgrading your Vision AI plan is a simple
                    process. You can do it directly from your account dashboard,
                    and the changes will take effect immediately. If you need to
                    scale your usage up or down, we'll make sure the transition
                    is seamless and your data remains secure.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
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

function ChevronDownIcon(props:any) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function XIcon(props:any) {
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
