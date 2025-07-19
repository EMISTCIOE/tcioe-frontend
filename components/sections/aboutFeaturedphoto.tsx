import React from "react";
import Image from "next/image";
import { AnimatedSection } from "@/components/animated-section";
import { InaugurationGalleryProps } from "@/types";

const InaugurationGallery = ({ items }: InaugurationGalleryProps) => {
  return (
      <section className="py-12 bg-gray-50 px-4 md:px-20">
        <AnimatedSection delay={0.1} >
      <h2 className="text-3xl font-bold text-center mb-10 text-primary-blue border-b-2 border-accent-orange inline-block">
        Historical Inauguration
      </h2>
</AnimatedSection>
        <AnimatedSection delay={0.2}>
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-10 justify-center">
        {items.map((item , idx) => (
          <div key={idx} className="text-center place-items-center">
            <div className="rounded-xl h-[75%] w-[75%] overflow-hidden shadow-lg border-b-4 border-orange-500 hover:scale-105 transform transition duration-300 ease-in-out">
              <Image
                src={item.src}
                alt={item.alt}
                width={600}
                height={100}
                className=" h-full w-full items-center object-cover rounded-xl"
              />
            </div>
            <p className="mt-4 text-lg text-gray-800 font-medium">{item.caption}</p>
          </div>
        ))}
      </div>
      </AnimatedSection>
    </section>
  );
};

export default InaugurationGallery;
