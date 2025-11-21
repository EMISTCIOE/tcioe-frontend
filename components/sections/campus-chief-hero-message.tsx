import Image from "next/image";
import type { CampusChiefMessageProps } from "@/types";
import { AnimatedSection } from "@/components/animated-section";
import { useState } from "react";

export const CampusChiefHeroMessage = ({
  name,
  title,
  image,
  message,
  fullMessage,
}: CampusChiefMessageProps) => {
  const [expanded, setExpanded] = useState(false);

  // Create a proper preview from the full message if no separate message is provided
  const fullText = fullMessage || message || "";
  const shouldShowToggle = fullText.length > 300;

  const preview = shouldShowToggle
    ? fullText.substring(0, 300) + "..."
    : fullText;
  const extra = shouldShowToggle ? fullText.substring(300) : "";

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-blue mb-6">
            Message From Campus Chief
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Text */}
            <div className="order-2 md:order-1">
              <p className="text-gray-800 text-base md:text-lg leading-relaxed text-justify">
                {expanded ? fullText : preview}
              </p>
              {shouldShowToggle && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-3 text-accent-orange hover:underline font-medium"
                >
                  {expanded ? "Read Less" : "Read More"}
                </button>
              )}
              <div className="mt-6">
                <p className="text-xl md:text-2xl font-semibold text-[#1A1A2E]">
                  {name}
                </p>
                <p className="text-gray-600">{title}</p>
              </div>
            </div>

            {/* Image */}
            <div className="order-1 md:order-2 flex justify-center">
              <Image
                src={image || "/placeholder.svg"}
                alt={name}
                width={380}
                height={380}
                className="rounded-full object-cover w-56 h-56 md:w-80 md:h-80 shadow-md"
                priority
              />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
