"use client";

import { HeroSection } from "@/components/sections/hero-section";
import { CampusChiefHeroMessage } from "@/components/sections/campus-chief-hero-message";
import { QuickStats } from "@/components/sections/quick-stats";
import { NewsEvents } from "@/components/sections/news-events";
import { DepartmentsOverview } from "@/components/sections/departments-overview";
import { GallerySection } from "@/components/sections/gallery-section";
import { QuickLinksSection } from "@/components/sections/quick-links-section";
import { UpcomingEventsSection } from "@/components/sections/upcoming-events-section"; // Updated import
import { useCollegeData } from "@/hooks/use-college-data";
import { useDepartments as useDeptList } from "@/hooks/use-departments";
import { useNotices } from "@/hooks/use-notices";
import { campusChiefData } from "@/data/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { FeaturedNoticePopup } from "@/components/FeaturedNoticePopup";
import { useFeaturedNoticePopup } from "@/hooks/use-featured-notice-popup";
import { useGlobalGallery } from "@/hooks/use-global-gallery";

export default function HomePage() {
  const { data, loading, error } = useCollegeData();
  const { departments: deptList } = useDeptList({ limit: 6, ordering: "name" });
  const { notices, loading: noticesLoading } = useNotices({
    page: 1,
    limit: 6,
    ordering: "-published_at",
  });
  const {
    notice: featuredNotice,
    isOpen: isPopupOpen,
    dismiss: dismissPopup,
  } = useFeaturedNoticePopup();
  const { items: galleryItems } = useGlobalGallery(9);

  if (loading || noticesLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
        <section className="py-12 md:py-20 bg-wheat-light">
          <div className="container mx-auto px-4 lg:px-6">
            <Skeleton className="h-8 w-1/2 mx-auto mb-10" />
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 bg-white p-6 rounded-xl shadow-lg">
              <Skeleton className="w-40 h-40 rounded-[30%]" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-20 bg-gradient-to-br from-white to-teal-light">
          <div className="container mx-auto px-4 lg:px-6">
            <Skeleton className="h-8 w-1/2 mx-auto mb-10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </section>
        <section className="py-12 md:py-20 bg-wheat-light">
          <div className="container mx-auto px-4 lg:px-6">
            <Skeleton className="h-8 w-1/2 mx-auto mb-10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </section>
        <section className="py-12 md:py-20 bg-gradient-to-br from-white to-teal-light">
          <div className="container mx-auto px-4 lg:px-6">
            <Skeleton className="h-8 w-1/2 mx-auto mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </section>
        <section className="py-12 md:py-20 bg-gradient-to-br from-white to-light-teal">
          <div className="container mx-auto px-4 lg:px-6">
            <Skeleton className="h-8 w-1/2 mx-auto mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-56 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </section>
        <section className="py-12 md:py-20 bg-wheat-light">
          <div className="container mx-auto px-4 lg:px-6">
            <Skeleton className="h-8 w-1/2 mx-auto mb-10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-56 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </section>
        <section className="py-12 md:py-20 bg-gradient-to-br from-white to-teal-light">
          <div className="container mx-auto px-4 lg:px-6">
            <Skeleton className="h-8 w-1/2 mx-auto mb-10" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  }

  const campusChiefMessage = campusChiefData;

  const quickLinks = [
    { label: "Admissions", href: "/admissions", icon: "UserPlus" },
    {
      label: "Academic Calendar",
      href: "/academics/calendar",
      icon: "CalendarDays",
    },
    { label: "Downloads", href: "/resources/downloads", icon: "Download" },
    { label: "Notices", href: "/notices", icon: "Megaphone" },
    { label: "Faculty Directory", href: "/directory", icon: "Users" },
  ];

  return (
    <>
      {featuredNotice && (
        <FeaturedNoticePopup
          notice={featuredNotice}
          open={isPopupOpen}
          onClose={dismissPopup}
        />
      )}
      <HeroSection
        backgroundImage="/data/hero.webp?height=800&width=1600"
        title="Innovating for a Brighter Future"
        subtitle="Empowering the next generation of engineers and architects through excellence in education and research."
        ctaButtons={[
          { label: "Explore Programs", href: "/academics", variant: "primary" },
          { label: "Apply Now", href: "/admissions", variant: "secondary" },
        ]}
      />
      {campusChiefMessage && <CampusChiefHeroMessage {...campusChiefMessage} />}
      <NewsEvents notices={notices || []} />
      <DepartmentsOverview
        departments={(deptList || []).map((dept) => ({
          name: dept.name,
          description: dept.briefDescription || "",
          icon: "Building",
          href: `/departments/${dept.slug}`,
          image: dept.thumbnail || null,
        }))}
      />
      <UpcomingEventsSection limit={6} />{" "}
      {/* New Events Section with campus and club events */}
      <GallerySection images={galleryItems} />
      <QuickLinksSection links={quickLinks} />
    </>
  );
}
