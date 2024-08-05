import Link from "next/link";

export default function Component() {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Scope of Services</h2>
          <p>
            Vision AI provides a range of services to help you connect to
            internal databases, generate ER diagrams, analyze database
            structures, and leverage NLP-powered processing with cutting-edge AI
            models. These services are designed to enhance your data management
            and analysis capabilities.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              You are responsible for providing accurate and up-to-date
              information when using our services.
            </li>
            <li>
              You must comply with all applicable laws and regulations when
              using our services.
            </li>
            <li>
              You are responsible for securing your own systems and data, and
              for implementing appropriate security measures.
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Data Privacy and Security</h2>
          <p>
            We take the privacy and security of your data very seriously. We use
            industry-standard encryption and security measures to protect your
            data, and we will never sell or share your data with third parties
            without your consent.
          </p>
          <p>
            You retain ownership of all data you provide to us, and you have the
            right to access, correct, or delete your data at any time.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Intellectual Property Rights
          </h2>
          <p>
            All intellectual property rights in the Vision AI services,
            including but not limited to software, algorithms, and
            documentation, are owned by Vision AI or its licensors.
          </p>
          <p>
            You are granted a limited, non-exclusive, non-transferable license
            to use the Vision AI services for your own internal business
            purposes, subject to the terms of this agreement.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Limitations of Liability</h2>
          <p>
            Vision AI will not be liable for any indirect, special, incidental,
            or consequential damages arising out of or related to your use of
            the services, including but not limited to lost profits, business
            interruption, or loss of data.
          </p>
          <p>
            In no event shall Vision AI&apos;s total liability exceed the amount paid
            by you for the services in the 12 months preceding the event giving
            rise to the claim.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Dispute Resolution</h2>
          <p>
            Any disputes arising out of or related to these terms of service
            shall be resolved through binding arbitration in accordance with the
            rules of the American Arbitration Association.
          </p>
          <p>
            The arbitration shall be conducted in English and the seat of the
            arbitration shall be [CITY, STATE].
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Termination</h2>
          <p>
            Vision AI reserves the right to terminate your access to the
            services at any time for any reason, including if we reasonably
            believe that you have violated these terms of service.
          </p>
          <p>
            Upon termination, you must cease all use of the Vision AI services
            and destroy any copies of the services in your possession.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Miscellaneous</h2>
          <p>
            These terms of service constitute the entire agreement between you
            and Vision AI and supersede all prior or contemporaneous agreements
            or representations, whether written or oral.
          </p>
          <p>
            If any provision of these terms of service is found to be invalid or
            unenforceable, the remaining provisions shall remain in full force
            and effect.
          </p>
        </div>
      </div>
      <footer className="mt-8 flex justify-between items-center border-t pt-4 text-sm text-muted-foreground">
        <p>&copy; 2024 Vision AI. All rights reserved.</p>
        <nav className="flex gap-4">
          <Link href="/privacy" className="hover:underline" prefetch={false}>
            Privacy Policy
          </Link>
          <Link href="/contact" className="hover:underline" prefetch={false}>
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
}
