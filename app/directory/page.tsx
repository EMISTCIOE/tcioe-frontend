"use client";

import { AnimatedSection } from "@/components/animated-section";
import { useEffect, useState } from "react";

interface PhoneNumber {
  id: number;
  department_name: string;
  phone_number: string;
  description: string;
  display_order: number;
}

export default function DirectoryPage() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        // Fetch from our frontend API route that proxies to the backend
        const response = await fetch("/api/directory/phone-numbers");
        if (!response.ok) {
          throw new Error("Failed to fetch phone numbers");
        }
        const data = await response.json();
        setPhoneNumbers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneNumbers();
  }, []);

  if (loading) {
    return (
      <AnimatedSection className="py-20 px-4 text-center">
        <h1 className="text-4xl font-bold text-primary-blue mb-4">Directory</h1>
        <p className="text-lg text-text-dark">Loading contact information...</p>
      </AnimatedSection>
    );
  }

  if (error) {
    return (
      <AnimatedSection className="py-20 px-4 text-center">
        <h1 className="text-4xl font-bold text-primary-blue mb-4">Directory</h1>
        <p className="text-lg text-red-600">
          Error loading contact information: {error}
        </p>
      </AnimatedSection>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light to-wheat-light">
      {/* Hero Section */}
      <AnimatedSection className="relative bg-gradient-to-r from-primary-blue to-secondary-blue text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Directory</h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto opacity-90">
            Contact information for departments and personnel
          </p>
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
      </AnimatedSection>

      {/* Phone Numbers Section */}
      <AnimatedSection className="py-12 px-4" delay={0.2}>
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-blue mb-3">
              Phone Numbers
            </h2>
            <p className="text-text-dark max-w-2xl mx-auto text-sm md:text-base">
              Contact numbers for various departments and sections of the
              institute
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>Department</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>Phone Number</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wide w-20">
                        Call
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {phoneNumbers.map((phoneNumber, index) => (
                      <tr
                        key={phoneNumber.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-base font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">
                                {phoneNumber.department_name}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {phoneNumber.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={`tel:${phoneNumber.phone_number}`}
                            className="text-lg font-mono bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:underline font-bold"
                          >
                            {phoneNumber.phone_number}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <a
                            href={`tel:${phoneNumber.phone_number}`}
                            className="inline-flex items-center justify-center w-10 h-10 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transform hover:scale-110 transition-all duration-300 group/btn"
                            title="Call this number"
                          >
                            <svg
                              className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4">
              {phoneNumbers.map((phoneNumber, index) => (
                <AnimatedSection
                  key={phoneNumber.id}
                  delay={0.05 * index}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {phoneNumber.department_name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {phoneNumber.description}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`tel:${phoneNumber.phone_number}`}
                        className="ml-3 inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        title="Call this number"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </a>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Phone Number</span>
                        <a
                          href={`tel:${phoneNumber.phone_number}`}
                          className="text-lg font-mono bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:underline font-bold"
                        >
                          {phoneNumber.phone_number}
                        </a>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {phoneNumbers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-light text-lg">
                No phone numbers available at the moment.
              </p>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Additional Contact Information */}
      <AnimatedSection
        className="py-12 px-4 bg-gradient-to-r from-gray-50 to-blue-50"
        delay={0.4}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-blue mb-8">
            General Information
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 p-6 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-orange to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary-blue mb-3">
                Address
              </h3>
              <p className="text-text-dark text-sm leading-relaxed">
                Thapathali Campus, Institute of Engineering
                <br />
                Thapathali, Kathmandu, Nepal
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 p-6 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-blue to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary-blue mb-3">
                Email
              </h3>
              <a
                href="mailto:info@tcioe.edu.np"
                className="text-accent-orange hover:text-accent-orange/80 transition-colors duration-200 hover:underline text-sm"
              >
                info@tcioe.edu.np
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 p-6 transition-all duration-300 group md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-purple to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary-blue mb-3">
                Office Hours
              </h3>
              <p className="text-text-dark text-sm leading-relaxed">
                Sunday - Friday
                <br />
                10:00 AM - 5:00 PM
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
