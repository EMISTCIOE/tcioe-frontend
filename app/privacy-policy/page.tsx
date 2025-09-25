import { AnimatedSection } from "@/components/animated-section";

export default function PrivacyPolicyPage() {
  return (
    <AnimatedSection className="container mx-auto px-4 lg:px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-primary-blue mb-4">Privacy Policy</h1>
        <p className="text-text-dark mb-6">
          This Privacy Policy explains how Thapathali Campus (IOE) collects,
          uses, and protects information when you use our websites and services.
        </p>

        <div className="space-y-6 text-sm leading-6 text-text-dark">
          <section>
            <h2 className="text-xl font-semibold">Information We Collect</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Contact details you provide (e.g., name, email, phone).</li>
              <li>Feedback and messages submitted through forms.</li>
              <li>Usage data such as pages visited and device info.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold">How We Use Information</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Respond to enquiries and provide student services.</li>
              <li>Improve website performance and user experience.</li>
              <li>Send updates with your consent (e.g., newsletters).</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Data Sharing</h2>
            <p className="mt-2">
              We do not sell your personal information. We may share limited
              data with service providers who process it on our behalf, bound by
              confidentiality and security obligations, or when required by law.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Data Retention</h2>
            <p className="mt-2">
              We retain information only as long as necessary for the purposes
              outlined here or as required by applicable regulations.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Your Choices</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Unsubscribe from newsletters at any time.</li>
              <li>Request access, correction, or deletion of your data.</li>
              <li>Control cookie settings via your browser.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="mt-2">
              For privacy questions, contact <a className="underline" href="mailto:privacy@tcioe.edu.np">privacy@tcioe.edu.np</a>.
            </p>
          </section>
        </div>
      </div>
    </AnimatedSection>
  );
}
