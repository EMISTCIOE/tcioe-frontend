import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { HeroSectionProps } from "@/types";
import { AnimatedSection } from "@/components/animated-section";

export const HeroSection = ({
  backgroundImage,
  title,
  subtitle,
  ctaButtons,
}: HeroSectionProps) => {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      <Image
        src={backgroundImage || "/data/hero.webp"}
        alt="Campus Background"
        layout="fill"
        objectFit="cover"
        quality={90}
        className="z-0"
        priority
      />
      <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center text-center px-4">
        <div className="max-w-3xl text-white space-y-4">
          <AnimatedSection delay={0.2}>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-xl">
              {title}
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <p className="text-md md:text-lg lg:text-xl font-medium opacity-95 drop-shadow-lg">
              {subtitle}
            </p>
          </AnimatedSection>
          <AnimatedSection
            delay={0.6}
            className="flex flex-col sm:flex-row justify-center gap-3 pt-3"
          >
            {ctaButtons.map((button, index) => (
              <Button
                key={index}
                asChild
                className={`${
                  button.variant === "primary"
                    ? "bg-accent-orange hover:bg-accent-orange/90 text-white"
                    : "bg-white hover:bg-gray-100 text-primary-blue border border-primary-blue"
                } px-6 py-2 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5`}
              >
                <Link href={button.href}>{button.label}</Link>
              </Button>
            ))}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
