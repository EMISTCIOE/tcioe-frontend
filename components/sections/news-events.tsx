import Link from "next/link";
import Image from "next/image";
import type { Notice } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedSection } from "@/components/animated-section";
import { FileText, Calendar, User } from "lucide-react";
import { stripHtmlTags, truncateText } from "@/lib/utils";

interface NewsEventsProps {
  notices: Notice[];
}

export const NewsEvents = ({ notices }: NewsEventsProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDisplayImage = (notice: Notice) => {
    // Check if there's a thumbnail
    if (notice.thumbnail) {
      return notice.thumbnail;
    }

    // Check if there's an image in medias
    const imageMedia = notice.medias?.find(
      (media) => media.mediaType === "IMAGE"
    );
    if (imageMedia) {
      return imageMedia.file;
    }

    // No image available
    return null;
  };

  const getPdfMedia = (notice: Notice) => {
    return notice.medias?.find((media) => media.mediaType === "DOCUMENT");
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-white to-teal-light">
      <div className="container mx-auto px-4 lg:px-6">
        <AnimatedSection>
          <h2 className="text-xl md:text-3xl font-bold text-center text-primary-blue mb-10">
            Latest News & Updates
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.slice(0, 3).map((notice, index) => {
            const displayImage = getDisplayImage(notice);
            const pdfMedia = getPdfMedia(notice);
            const hasOnlyPdf = !displayImage && pdfMedia;

            return (
              <AnimatedSection key={notice.uuid} delay={0.1 * index}>
                <Card className="h-full flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 transform hover:-translate-y-0.5">
                  {displayImage ? (
                    <div className="relative w-full h-40">
                      <Image
                        src={displayImage}
                        alt={notice.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-xl"
                      />
                    </div>
                  ) : hasOnlyPdf ? (
                    <div className="relative w-full h-40 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <FileText className="h-16 w-16 text-white" />
                    </div>
                  ) : (
                    <div className="relative w-full h-40 bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                      <FileText className="h-16 w-16 text-white" />
                    </div>
                  )}

                  <CardHeader className="p-4 pb-2">
                    <CardDescription className="text-xs text-text-light mb-1 flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {formatDate(notice.publishedAt)} | {notice.category.name}
                    </CardDescription>
                    <CardTitle className="text-base font-semibold text-text-dark line-clamp-2">
                      {notice.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-4 flex-grow">
                    <p className="text-sm text-text-dark line-clamp-3">
                      {truncateText(stripHtmlTags(notice.description || ""))}
                    </p>
                    {notice.author && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <User className="h-3 w-3" />
                        <span>{notice.author.fullName}</span>
                      </div>
                    )}
                  </CardContent>

                  <div className="p-4 pt-0">
                    {pdfMedia ? (
                      <div className="flex gap-2">
                        <Button
                          asChild
                          variant="link"
                          className="text-primary-blue hover:text-secondary-blue p-0 h-auto text-sm flex-1"
                        >
                          <Link href={`/notices/${notice.slug}`}>
                            Read More
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <a
                            href={pdfMedia.file}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            PDF
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <Button
                        asChild
                        variant="link"
                        className="text-primary-blue hover:text-secondary-blue p-0 h-auto text-sm"
                      >
                        <Link href={`/notices/${notice.slug}`}>Read More</Link>
                      </Button>
                    )}
                  </div>
                </Card>
              </AnimatedSection>
            );
          })}
        </div>
        <AnimatedSection delay={0.4} className="text-center mt-10">
          <Button
            asChild
            className="bg-accent-orange hover:bg-accent-orange/90 text-white px-6 py-2 text-base rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Link href="/notices">View All News</Link>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};
