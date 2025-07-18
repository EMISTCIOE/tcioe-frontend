"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, MenuIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AnnouncementBar } from "./announcement-bar";
import { useCollegeData } from "@/hooks/use-college-data";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const { data, loading } = useCollegeData();
  

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      name: "About",
      href: "/about",
      dropdown: [
        { name: "Mission, Vision and Values", href: "/about/mission-vision" },
        { name: "Organization Chart", href: "/about/organization-chart" },
        { name: "Key Campus Officials", href: "/about/officials" },
        { name: "Campus Sections", href: "/about/sections" },
        { name: "Campus Units", href: "/about/units" },
      ],
    },
    {
      name: "Academics",
      href: "/academics",
      dropdown: [
        { name: "Undergraduate Programs", href: "/academics/undergraduate" },
        { name: "Graduate Programs", href: "/academics/graduate" },
        { name: "Academic Calendar", href: "/academics/calendar" },
      ],
    },
    {
      name: "Research",
      href: "/research",
      dropdown: [
        { name: "Research Areas", href: "/research/areas" },
        { name: "Publications", href: "/research/publications" },
        { name: "Research Centers", href: "/research/centers" },
      ],
    },
    {
      name: "Departments",
      href: "/departments",
      dropdown: [
        { name: "Applied Science", href: "/departments/applied-science" },
        { name: "Architecture", href: "/departments/architecture" },
        {
          name: "Automobile and Mechanical Engineering",
          href: "/departments/automobile-mechanical",
        },
        { name: "Civil Engineering", href: "/departments/civil" },
        {
          name: "Electronics and Computer Engineering",
          href: "/departments/electronics-computer",
        },
        { name: "Industrial Engineering", href: "/departments/industrial" },
      ],
    },
    {
      name: "Admissions",
      href: "/admissions",
      dropdown: [
        { name: "Undergraduate Admissions", href: "/admissions/undergraduate" },
        { name: "Graduate Admissions", href: "/admissions/graduate" },
        { name: "Scholarships", href: "/admissions/scholarships" },
      ],
    },
    {
      name: "Notices",
      href: "/notices",
      dropdown: [
        { name: "Latest Notices", href: "/notices" },
        { name: "Exam Notices", href: "/notices/exams" },
        { name: "Admission Notices", href: "/notices/admissions" },
      ],
    },
    {
      name: "Resources",
      href: "/resources",
      dropdown: [
        { name: "Academic Calendar", href: "/resources/academic-calendar" },
        { name: "Campus Reports", href: "/resources/campus-reports" },
        { name: "Magazines", href: "/resources/magazines" },
        { name: "Downloads", href: "/resources/downloads" },
        {
          name: "Professional Code of Conduct",
          href: "/resources/code-of-conduct",
        },
        {
          name: "Tribhuvan University Act and Rules",
          href: "/resources/tu-act-rules",
        },
      ],
    },
    {
      name: "Campus Life",
      href: "/campus-life",
      dropdown: [
        { name: "Unions", href: "/campus-life/unions" },
        { name: "Student Clubs", href: "/campus-life/clubs" },
        { name: "Sports Activities", href: "/campus-life/sports" },
        { name: "Campus Festivals", href: "/campus-life/festivals" },
        { name: "Technological Fests", href: "/campus-life/tech-fests" },
      ],
    },
  ];

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-header-top-bg text-white text-sm py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-accent-orange transition-colors duration-300">
              Students
            </Link>
            <span className="border-l border-white h-5"></span>
            <Link href="#" className="hover:text-accent-orange transition-colors duration-300">
              Faculty & Staff
            </Link>
            <span className="border-l border-white h-5"></span>
            <Link href="#" className="hover:text-accent-orange transition-colors duration-300">
              Alumni
            </Link>

          </div>
          <div className="flex space-x-6 items-center">
            <Link href="#" className="hover:text-accent-orange transition-colors duration-300">
              Library
            </Link>
            <span className="border-l border-white h-5"></span>
            <Link href="#" className="hover:text-accent-orange transition-colors duration-300">
              Journal
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-white/20"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div
        className={cn(
          "bg-white py-4 transition-all duration-300",
          isSticky ? "sticky top-0 shadow-md z-50" : ""
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/data/logo.jpg?height=60&width=60" // Placeholder for college logo
              width={60}
              height={60}
              alt="Tribhuvan University Institute of Engineering Thapathali Campus Logo"
              className="flex-shrink-0"
            />
            <div className="flex flex-col leading-tight text-primary-blue">
              <span className="text-lg font-bold">Tribhuvan University</span>
              <span className="text-base font-semibold">
                Institute of Engineering
              </span>
              <span className="text-sm text-text-dark">Thapathali Campus</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 text-sm text-text-dark">
              <Image
                src="/data/accrdiated.webp?height=50&width=50" // Placeholder for UGC logo
                width={50}
                height={50}
                alt="UGC Accreditation Badge"
                className="flex-shrink-0"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-semibold">
                  Accredited by University Grants Commision
                </span>
                <span className="text-xs">(UGC) Nepal</span>
                <span className="text-xs">
                  Quality Education Since 1930 A.D.
                </span>
              </div>
            </div>
            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
                <div className="flex flex-col gap-4 pt-8">
                  {navItems.map((item) => (
                    <div key={item.name}>
                      {item.dropdown && item.dropdown.length > 0 ? (
                        <details className="group">
                          <summary className="flex items-center justify-between py-2 text-lg font-medium text-text-dark hover:text-primary-blue cursor-pointer">
                            {item.name}
                            <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                          </summary>
                          <div className="pl-4 pt-2 flex flex-col gap-2">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block py-2 px-3 rounded-md text-base text-text-light hover:bg-primary-blue/10 hover:text-primary-blue transition-colors"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </details>
                      ) : (
                        <Link
                          href={item.href}
                          className="block py-2 text-lg font-medium text-text-dark hover:text-primary-blue transition-colors"
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Navigation Bar (Desktop) */}
      <nav className="bg-white border-t border-gray-200 hidden md:block">
        <div className="container mx-auto flex justify-center">
          <ul className="flex space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.dropdown && item.dropdown.length > 0 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-text-dark hover:bg-background-light hover:text-primary-blue px-4 py-3 text-base font-medium transition-colors duration-200"
                      >
                        {item.name}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 shadow-lg rounded-lg border border-gray-200 p-1">
                      {item.dropdown.map((subItem) => (
                        <DropdownMenuItem key={subItem.name} asChild>
                          <Link
                            href={subItem.href}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-text-dark rounded-md hover:bg-primary-blue/10 hover:text-primary-blue transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center text-text-dark hover:bg-background-light hover:text-primary-blue px-4 py-3 text-base font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Announcement Bar */}
      <div className="bg-primary-blue text-white py-2 px-4 text-sm overflow-hidden relative">
        <div className="container mx-auto flex items-center">
          <div className="flex-shrink-0 font-semibold mr-4">Announcements</div>
          <div className="flex-1 text-center relative h-5 overflow-hidden">
            {!loading &&
              data?.announcements &&
              data.announcements.length > 0 && (
                <AnnouncementBar announcements={data.announcements} />
              )}
          </div>
        </div>
      </div>
    </header>
  );
};
