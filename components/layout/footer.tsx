"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        // Show button after scrolling 300px
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const topLinks = [
    { label: "About", href: "/about" },
    { label: "Examination Control Board", href: "/examination-board" },
    { label: "Downloads", href: "/downloads" },
    { label: "Notices", href: "/notices" },
    { label: "Campus Map", href: "/campus-map" },
    { label: "Directory", href: "/directory" },
  ];

  const departments = [
    { label: "Applied Science", href: "/departments/applied-science" },
    { label: "Architecture", href: "/departments/architecture" },
    {
      label: "Automobile and Mechanical Engineering",
      href: "/departments/automobile-mechanical",
    },
    { label: "Civil Engineering", href: "/departments/civil" },
    {
      label: "Electronics and Computer Engineering",
      href: "/departments/electronics-computer",
    },
    { label: "Industrial Engineering", href: "/departments/industrial" },
  ];

  const bottomLinks = [
    { label: "Annual Reports", href: "/reports" },
    { label: "Academic Calendar", href: "/academics/calendar" },
    { label: "Act & Rules", href: "/resources/tu-act-rules" },
    { label: "Code of Conducts", href: "/resources/code-of-conduct" },
  ];

  const legalLinks = [
    { label: "Accessibility", href: "/accessibility" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of use", href: "/terms-of-use" },
    { label: "Sitemap", href: "/sitemap" },
  ];

  return (
    <footer className="bg-primary-blue text-footer-text py-8 md:py-12 relative">
      <div className="container mx-auto px-4 lg:px-6 flex flex-col space-y-6">
        {/* Top Links Section */}
        <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 text-base font-normal">
          {topLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="border-t border-footer-border pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Departments</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-2 text-base">
            {departments.map((dept) => (
              <Link
                key={dept.label}
                href={dept.href}
                className="hover:text-white transition-colors duration-200 text-center sm:text-left"
              >
                {dept.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-footer-border pt-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 text-base font-normal">
            {bottomLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-footer-border pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo and Name */}
          <Link
            href="/"
            className="flex items-center gap-3 text-white text-center md:text-left group"
          >
            <Image
              src="/data/logo.svg" // Placeholder for the college logo
              width={60}
              height={60}
              alt="Tribhuvan University Institute of Engineering Thapathali Campus Logo"
              className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold">Tribhuvan University</span>
              <span className="text-sm font-semibold">
                Institute of Engineering
              </span>
              <span className="text-xs">Thapathali Campus</span>
            </div>
          </Link>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <Link href="#" aria-label="Facebook">
              <Facebook className="h-7 w-7 text-white hover:text-accent-orange transition-colors duration-200 transform hover:scale-110" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Instagram className="h-7 w-7 text-white hover:text-accent-orange transition-colors duration-200 transform hover:scale-110" />
            </Link>
            <Link href="#" aria-label="LinkedIn">
              <Linkedin className="h-7 w-7 text-white hover:text-accent-orange transition-colors duration-200 transform hover:scale-110" />
            </Link>
          </div>
        </div>

        {/* Legal Links and Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs mt-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-center md:text-right mt-2 md:mt-0">
            &copy; {currentYear} IOE Thapathali Campus - All rights reserved
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-8 right-8 bg-accent-orange text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50",
          showBackToTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        aria-label="Back to top"
      >
        <ArrowUp className="h-6 w-6" />
      </button>
    </footer>
  );
};
