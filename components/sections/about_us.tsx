import React from "react";
import Image from "next/image";
import { AnimatedSection } from "@/components/animated-section"

const AboutSection = () => {
  return (
      <section className="w-full">
          <AnimatedSection delay={0.1}>
        {/* Top section with gradient and image */}
        <h2 className="text-3xl md:text-4xl font-bold text-primary-blue mb-6 border-b-2 border-accent-orange inline-block">
          About Thapathali Campus
        </h2>
        </AnimatedSection>

      <div className="bg-gradient-to-r from-blue-950 to-blue-800 text-white px-6 py-12 md:flex md:items-center md:justify-between gap-8">
        <div className="md:w-2/3">
          <div className="border-l-4 text-justify border-orange-500 pl-4 mb-4">
        <AnimatedSection delay={0.3}>
            <p>
              In the presence of Late King Mahendra, Late Dr. Heinrich Lubke, President of
              Federal Republic of Germany inaugurated Technical Institute (TTI) on 29th of
              Falgun 2023 B.S. (13th March 1967). The Technical Training Institute (TTI)
              offered midlevel manpower courses in mechanical engineering, automobile
              engineering, electrical engineering and mechanical drafting.
            
            
              With the assistance of the Government of Germany, the Technical Training
              Institute Project (TTIP) was established in Nepal in 2019 B.S. (1963 AD). TTI
              started vocational training for S.L.C. graduates from 2022 B.S. to 2024 B.S.
              Meanwhile, the Mechanical Drafting course was transferred to Pulchowk, IOE.
            </p>
        </AnimatedSection>
          </div>
        </div>

        <div className="md:w-1/3 mt-8 md:mt-0">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/data/accrdiated.webp" // Replace with actual image path
              alt="Thapathali Campus"
              width={500}
              height={300}
              className="w-full h-auto object-cover"
              />
          </div>
        </div>
              
      </div>

      {/* Bottom section with white background */}
      <AnimatedSection delay={0.2}>

      <div className="bg-white px-6 py-12">
        <p className="text-gray-800  w-full text-justify text-base md:text-lg leading-relaxed">
          Thapathali Campus, formerly known as Technical Training Institute (TTI), was renamed and became part of Tribhuvan University (T.U.) as the Institute of Engineering in 1973 AD. In 1977 AD, the campus introduced a two-year proficiency certificate level (PCL) course for SLC students. In 1987 AD, it started offering three-year diploma courses in Mechanical Engineering and Automobile Engineering. In 2002 AD, diploma programs in Electronics Engineering and Computer Engineering were added. The Institute of Engineering (IOE) policy led to the introduction of Bachelor's programs: Industrial Engineering in 2006 AD, Civil Engineering in 2066 BS, Electronics and Communication Engineering in 2067 BS, and Mechanical Engineering in 2068 BS. New intakes in diploma courses ceased in 2014 AD. The campus expanded further with the addition of Bachelor's in Architecture and M.Sc. in Earthquake Engineering in 2015 AD, Bachelor's in Automobile Engineering in 2016 AD, and M.Sc. in Mechanical Design & Manufacturing in 2017 AD. The most recent addition is the M.Sc. in Informatics and Intelligent Systems Engineering in 2020 AD, conducted in the evening session.
        </p>
      </div>
      </AnimatedSection>
    </section>
  );
};

export default AboutSection;