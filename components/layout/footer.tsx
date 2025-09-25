"use client";

import Link from "next/link";
import React from "react";
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
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Load departments dynamically to avoid stale routes
  const [departments, setDepartments] = useState<Array<{ label: string; href: string }>>([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("/api/departments?limit=20&ordering=name");
        if (!res.ok) return;
        const data = await res.json();
        const list = (data.results || []).map((d: any) => ({
          label: d.name,
          href: `/departments/${d.slug}`,
        }));
        setDepartments(list);
      } catch (e) {
        // swallow errors in footer
      }
    };
    fetchDepartments();
  }, []);

  // Footer columns
  const quickLinks = [
    { label: "About", href: "/about" },
    { label: "Campus Map", href: "/campus-map" },
    { label: "Contact Us", href: "/contact" },
    { label: "Directory", href: "/directory" },
    { label: "Examination Control Board", href: "/examination-board" },
  ];

  const resources = [
    { label: "Academic Calendar", href: "/academics/calendar" },
    { label: "Annual Reports", href: "/reports" },
    { label: "Code of Conducts", href: "/resources/code-of-conduct" },
    { label: "Downloads", href: "/downloads" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ];

  const legalLinks = [
    { label: "Accessibility", href: "/accessibility" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of use", href: "/terms-of-use" },
    { label: "Sitemap", href: "/sitemap" },
  ];

  return (
    <footer className="bg-[#1A1A2E] text-footer-text py-10 md:py-14 relative">
      <div className="container mx-auto px-4 lg:px-6 flex flex-col gap-10">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "2500+", label: "Students" },
            { value: "400+", label: "Faculty Members" },
            { value: "15+", label: "Programs" },
            { value: "100+", label: "Research Projects" },
          ].map((item) => (
            <div key={item.label} className="text-center md:text-left">
              <div className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                {item.value}
              </div>
              <div className="text-lg md:text-xl mt-1">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-footer-border" />

        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
          {/* Brand column */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-3 text-white group">
              <Image
                src="/data/logo.svg"
                width={60}
                height={60}
                alt="Tribhuvan University Institute of Engineering Thapathali Campus Logo"
                className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="leading-tight">
                <div className="text-base font-bold">Institute of Engineering</div>
                <div className="text-xl font-semibold -mt-0.5">Thapathali Campus</div>
              </div>
            </Link>
            <p className="text-sm text-footer-text/80 max-w-xs">
              Accredited by University Grants Commission (UGC) Nepal. Quality
              Education Since 1930 A.D.
            </p>
            <div className="flex items-center gap-3">
              <Link href="#" aria-label="Facebook" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Facebook className="h-5 w-5 text-white" />
              </Link>
              <Link href="#" aria-label="Instagram" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Instagram className="h-5 w-5 text-white" />
              </Link>
              <Link href="#" aria-label="LinkedIn" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Linkedin className="h-5 w-5 text-white" />
              </Link>
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-white font-semibold tracking-wide mb-3">QUICK ACCESS</h4>
            <div className="h-0.5 w-10 bg-accent-orange mb-4" />
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-accent-orange transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-white font-semibold tracking-wide mb-3">DEPARTMENTS</h4>
            <div className="h-0.5 w-10 bg-accent-orange mb-4" />
            <ul className="space-y-2">
              {(departments.slice(0, 6) || []).map((dept) => (
                <li key={dept.label}>
                  <Link href={dept.href} className="hover:text-accent-orange transition-colors">
                    {dept.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold tracking-wide mb-3">RESOURCES</h4>
            <div className="h-0.5 w-10 bg-accent-orange mb-4" />
            <ul className="space-y-2">
              {resources.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-accent-orange transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-footer-border" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
          <p className="text-center md:text-left">
            &copy; {currentYear} IOE Thapathali Campus - All rights reserved
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-1">
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-8 right-8 bg-accent-orange text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50",
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
        aria-label="Back to top"
      >
        <ArrowUp className="h-6 w-6" />
      </button>
    </footer>
  );
};
