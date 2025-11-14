import Image from "next/image";
import Link from "next/link";
import type { GallerySectionProps } from "@/types";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/animated-section";

export const GallerySection = ({ images }: GallerySectionProps) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-wheat-light">
      <div className="container mx-auto px-4 lg:px-6">
        <AnimatedSection>
          <h2 className="text-xl md:text-3xl font-bold text-center text-[#1A1A2E] mb-10">
            Our Campus Gallery
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.slice(0, 6).map((item, index) => (
            <AnimatedSection key={item.uuid} delay={0.1 * index}>
              <div className="relative w-full h-56 overflow-hidden rounded-xl shadow-lg group hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.caption || item.sourceName}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {item.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-base font-semibold">{item.caption}</p>
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
        <AnimatedSection delay={0.4} className="text-center mt-10">
          <Button
            asChild
            className="bg-accent-orange hover:bg-accent-orange/90 text-white px-6 py-2 text-base rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Link href="/gallery">View All Photos</Link>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};
