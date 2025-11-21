import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function AdmissionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Admissions</h1>
          <p className="text-gray-600 mt-2">
            Join Nepal's premier engineering and architecture institution.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Undergraduate Programs */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Undergraduate Programs
            </h2>
            <p className="text-gray-600 mb-4">
              Bachelor's degrees in Engineering & Architecture
            </p>

            <div className="mb-4">
              <div className="text-sm font-medium text-gray-900 mb-2">
                Available Programs:
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Civil Engineering (BCE)</li>
                <li>• Computer Engineering (BCT)</li>
                <li>• Electronics & Communication (BEX)</li>
                <li>• Architecture (B.Arch)</li>
                <li>• Electrical Engineering (BEL)</li>
                <li>• Mechanical Engineering (BME)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Link
                href="https://admission.tcioe.edu.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Apply Now <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="https://admission.tcioe.edu.np/"
                target="_blank"
                className="flex items-center justify-center w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50"
              >
                Apply Online <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Scholarships */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Scholarships & Financial Aid
            </h2>
            <p className="text-gray-600 mb-4">
              Financial assistance and quota opportunities
            </p>

            <div className="mb-4">
              <div className="text-sm font-medium text-gray-900 mb-2">
                Available Quotas:
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Female Quota (10% reservation)</li>
                <li>• Dalit Community Quota</li>
                <li>• Janajati Community Quota</li>
                <li>• Madhesi Community Quota</li>
                <li>• Remote Area Quota</li>
                <li>• Various Financial Aid Programs</li>
              </ul>
            </div>

            <Link
              href="/admissions/scholarships"
              className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              View Scholarships
            </Link>
          </div>
        </div>

        {/* Graduate Programs */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Graduate Programs
            </h2>
            <p className="text-gray-600 mb-6">
              Master's and Ph.D. programs for advanced study and research.
              Applications are processed through separate dedicated portals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="https://mscadmission.tcioe.edu.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50"
              >
                M.Sc. Admissions <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/research"
                className="flex items-center justify-center border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50"
              >
                Research Programs
              </Link>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="border rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Need Admission Guidance?
            </h2>
            <p className="text-gray-600 mb-6">
              Our admissions team is ready to help you navigate the application
              process and answer any questions about our programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
              >
                Contact Admissions
              </Link>
              <Link
                href="/about"
                className="border border-gray-300 text-gray-700 py-2 px-6 rounded hover:bg-gray-50"
              >
                Learn About TCIOE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
