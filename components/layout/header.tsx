"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, MenuIcon, ChevronDown, MessageSquare } from "lucide-react";
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
import { useDepartments as useDeptList } from "@/hooks/use-departments";
import { useCampusDivisions } from "@/hooks/use-campus-divisions";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { normalizeCode } from "@/lib/department-mapping";

interface NavSubItem {
  name: string;
  href: string;
  external?: boolean;
  dropdown?: NavSubItem[];
}

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
  dropdown?: NavSubItem[];
}

export const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { data, loading } = useCollegeData();
  const { departments: deptList } = useDeptList({
    limit: 20,
    ordering: "name",
  });
  const { items: sectionLinks } = useCampusDivisions("sections", {
    limit: 8,
    ordering: "display_order",
  });
  const { items: unitLinks } = useCampusDivisions("units", {
    limit: 8,
    ordering: "display_order",
  });

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
        {
          name: "Campus Sections",
          href: "/about/sections",
          dropdown: sectionLinks.map((section) => ({
            name: section.name,
            href: `/about/sections/${section.slug}`,
          })),
        },
        {
          name: "Campus Units",
          href: "/about/units",
          dropdown: unitLinks.map((unit) => ({
            name: unit.name,
            href: `/about/units/${unit.slug}`,
          })),
        },
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
        { name: "Research Facilities", href: "/research/facilities" },
      ],
    },
    {
      name: "Departments",
      href: "/departments",
      dropdown: (deptList || []).map((d) => ({
        name: d.name,
        href: `/departments/${
          d.shortName ? normalizeCode(d.shortName) : d.slug
        }`,
      })),
    },
    {
      name: "Admissions",
      href: "https://admission.tcioe.edu.np",
      external: true,
      dropdown: [
        {
          name: "Undergraduate Admissions",
          href: "https://admission.tcioe.edu.np/",
          external: true,
        },
        {
          name: "Graduate Admissions",
          href: "https://mscadmission.tcioe.edu.np/",
          external: true,
        },
        {
          name: "Scholarships",
          href: "/admissions/scholarships",
          external: false,
        },
      ],
    },
    {
      name: "Notices",
      href: "/notices",
    },
    {
      name: "Resources",
      href: "/resources",
      dropdown: [
        { name: "Gallery", href: "/gallery" },
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
        { name: "Festivals", href: "/campus-life/festivals" },
        { name: "Club Events", href: "/campus-life/club-events" },
      ],
    },
  ];

  const navLinkBase =
    "h-full px-4 py-3 text-sm md:text-base font-medium leading-tight text-text-dark transition-colors duration-200 hover:bg-background-light hover:text-primary-blue";

  return (
    <header className="w-full">
      {/* Top Bar - hidden on small screens to prevent overflow */}
      <div className="bg-[#F1F1F1] text-black text-[10px] md:text-sm py-2 px-4 hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-2 md:space-x-6">
            <Link
              href="#"
              className="hover:text-accent-orange transition-colors duration-300"
            >
              Students
            </Link>
            <span className="border-l border-black h-3 md:h-5"></span>
            <Link
              href="#"
              className="hover:text-accent-orange transition-colors duration-300"
            >
              Faculty & Staff
            </Link>
            <span className="border-l border-black h-3 md:h-5"></span>
            <Link
              href="#"
              className="hover:text-accent-orange transition-colors duration-300"
            >
              Alumni
            </Link>
          </div>
          <div className="flex space-x-2 md:space-x-6 items-center">
            <Link
              href="#"
              className="hover:text-accent-orange transition-colors duration-300"
            >
              Library
            </Link>
            <span className="border-l border-black h-3 md:h-5"></span>
            <Link
              href="#"
              className="hover:text-accent-orange transition-colors duration-300"
            >
              Journal
            </Link>
            <Link
              href="/suggestion-box"
              className="inline-flex items-center hover:underline text-orange-600 hover:text-orange-400 transition-colors"
              title="Share your feedback and suggestions"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Suggestions
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-black hover:bg-black/20"
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
              <span className="text-base sm:text-lg font-bold">
                Tribhuvan University
              </span>
              <span className="text-sm sm:text-base font-semibold">
                Institute of Engineering
              </span>
              <span className="text-xs sm:text-sm text-text-dark">
                Thapathali Campus
              </span>
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
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] p-6 overflow-y-auto"
              >
                <div className="flex flex-col gap-4 pt-8">
                  {/* Top Navigation Items */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Quick Links
                    </h3>
                    <div className="flex flex-col gap-2">
                      <Link
                        href="#"
                        onClick={() => setIsSheetOpen(false)}
                        className="block py-2 text-base text-text-dark hover:text-primary-blue transition-colors"
                      >
                        Library
                      </Link>
                      <Link
                        href="#"
                        onClick={() => setIsSheetOpen(false)}
                        className="block py-2 text-base text-text-dark hover:text-primary-blue transition-colors"
                      >
                        Journal
                      </Link>
                      <Link
                        href="/suggestion-box"
                        onClick={() => setIsSheetOpen(false)}
                        className="inline-flex items-center py-2 text-base text-orange-600 hover:text-orange-700 transition-colors font-medium"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Suggestion Box
                      </Link>
                    </div>
                  </div>

                  {/* Main Navigation */}
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
                                onClick={() => setIsSheetOpen(false)}
                                className="block py-2 px-3 rounded-md text-base text-text-light hover:bg-primary-blue/10 hover:text-primary-blue transition-colors"
                                {...((subItem as NavSubItem).external && {
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                })}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </details>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsSheetOpen(false)}
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
          <ul className="flex items-center md:space-x-8">
            {navItems.map((item) => (
              <li key={item.name} className="flex items-center h-full">
                {item.dropdown && item.dropdown.length > 0 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`${navLinkBase} gap-2`}
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
                            {...((subItem as NavSubItem).external && {
                              target: "_blank",
                              rel: "noopener noreferrer",
                            })}
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
                    className={`flex items-center justify-center ${navLinkBase}`}
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
      <div className="bg-[#F97A00] text-white py-2 px-4 text-sm overflow-hidden relative">
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
