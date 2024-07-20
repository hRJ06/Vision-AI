"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Component() {
    const router = useRouter();
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
        <p className="text-muted-foreground">
          At Vision AI, we are committed to protecting the privacy and security of your data. This privacy policy
          outlines how we collect, use, and safeguard the information you provide to us.
        </p>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Data Collection</h2>
            <p className="text-muted-foreground">
              Vision AI collects various types of data to provide our core platform features, including user
              information, database connections, and usage analytics. This data helps us understand how you interact
              with our platform and improve your experience.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Data Usage</h2>
            <p className="text-muted-foreground">
              The data we collect is used to power the key functionalities of the Vision AI platform, such as connecting
              to your internal databases, generating ER diagrams, analyzing database structures, and leveraging our
              NLP-powered AI models to provide insights and recommendations.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Data Security</h2>
            <p className="text-muted-foreground">
              We take appropriate measures to secure your data and protect it from unauthorized access or misuse. This
              includes implementing industry-standard encryption, access controls, and monitoring systems to ensure the
              confidentiality and integrity of your information.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Data Sharing</h2>
            <p className="text-muted-foreground">
              We may share your data with trusted third-party partners or service providers who assist us in delivering
              the functionality of the Vision AI platform. These partners are bound by confidentiality agreements and
              are required to handle your data with the same level of care and security as we do.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">User Rights</h2>
            <p className="text-muted-foreground">
              You have the right to access, correct, delete, and opt-out of the collection and use of your data. If you
              have any questions or concerns about your data, please contact our privacy team at{" "}
              <Link href="#" className="underline" prefetch={false}>
                privacy@visionai.com
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => router.push('/faq')}
          >
            Learn More
          </button>
          <button
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            onClick={() => router.push('/contact')}
          >
            Contact Us
          </button>
        </div>
      </div>
      <footer className="mt-12 border-t pt-6 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <p>&copy; 2024 Vision AI. All rights reserved.</p>
          <nav className="flex items-center space-x-4">
            <Link href="/terms" className="hover:underline" prefetch={false}>
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:underline" prefetch={false}>
              Privacy Policy
            </Link>
            <Link href="#" className="hover:underline" prefetch={false}>
              Cookie Policy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}