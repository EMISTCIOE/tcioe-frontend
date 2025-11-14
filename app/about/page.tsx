import { AnimatedSection } from "@/components/animated-section";
import Image from "next/image";

export default function MissionVisionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light to-wheat-light">
      {/* Compact Hero Section */}
      <AnimatedSection className="relative bg-gradient-to-r from-primary-blue to-secondary-blue text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Mission, Vision & Values
          </h1>
          <p className="text-base md:text-lg max-w-3xl mx-auto">
            Our guiding principles and aspirations
          </p>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
      </AnimatedSection>

      {/* Historical Context Section */}
      <AnimatedSection className="py-16 px-4" delay={0.2}>
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-primary-blue mb-6">
                Our Journey
              </h2>
              <div className="space-y-3 text-text-dark leading-relaxed text-sm text-justify">
                <p>
                  In the presence of Late King Mahendra, Late Dr. Heinrich
                  Lubke, President of Federal Republic of Germany inaugurated
                  Technical Institute (TTI) on 29th of Falgun 2023 B.S.(13th
                  March 1967). The Technical Training Institute(TTI) offered
                  midlevel manpower course in mechanical engineering, automobile
                  engineering, electrical engineering and mechanical drafting
                  beginning.
                </p>
                <p>
                  With the assistance from the Government of Federal republic of
                  Germany, Technical Training Institute Project (TTIP) was
                  established in Nepal in 2019 B.S.(1963 AD), with the sole
                  objective of producing trained tradespersons and technicians
                  needed for the development of the country. TTI started three
                  years vocational training in Mechanical, Automobile and
                  Electrical trades for S.L.C. graduates from 2022 B.S.(1966 AD)
                  to 2024 B.S. (1968 AD) At the meantime, the three years course
                  in Mechanical Drafting was transferred to Pulchowk, IOE.
                </p>
                <p>
                  Thapathali Campus, formerly known as Technical Training
                  Institute (TTI), was renamed and became part of Tribhuvan
                  University (T.U.) as the Institute of Engineering in 1973 AD.
                  In 1977 AD, the campus introduced a two-year proficiency
                  certificate level (PCL) course for SLC students. In 1987 AD,
                  it started offering three-year diploma courses in Mechanical
                  Engineering and Automobile Engineering. In 2002 AD, diploma
                  programs in Electronics Engineering and Computer Engineering
                  were added.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="relative">
                <Image
                  src="/images/campus.jpg"
                  alt="Thapathali Campus View"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg w-full h-64 object-cover"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                  <p className="text-white text-sm font-medium">
                    Thapathali Campus - Institute of Engineering
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Images Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <AnimatedSection delay={0.3}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <Image
                  src="/images/history.webp"
                  alt="Epigraphy of inauguration of Thapathali campus"
                  width={500}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-primary-blue mb-2">
                    Historical Epigraphy
                  </h3>
                  <p className="text-text-light text-sm">
                    Epigraphy of inauguration of Thapathali campus
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <Image
                  src="/images/kingmahendra.webp"
                  alt="Inauguration by Late King Mahendra B.B. Shah and German Chancellor Dr.Heinrich Lubke"
                  width={500}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-primary-blue mb-2">
                    Historic Inauguration
                  </h3>
                  <p className="text-text-light text-sm">
                    Inauguration by Late King Mahendra B.B. Shah and German
                    Chancellor Dr.Heinrich Lubke
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Evolution Timeline */}
          <AnimatedSection delay={0.5}>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
              <h3 className="text-2xl font-bold text-primary-blue mb-6 text-center">
                Institute Evolution
              </h3>
              <div className="space-y-4 text-text-dark">
                <p>
                  The Institute of Engineering led to the introduction of
                  Bachelor's programs: Industrial Engineering in 2006 AD, Civil
                  Engineering in 2066 BS, Electronics and Communication
                  Engineering in 2067 BS, and Mechanical Engineering in 2068 BS.
                  New intakes in diploma courses ceased in 2014 AD. The campus
                  expanded further with the addition of Bachelor's in
                  Architecture and M.Sc. in Earthquake Engineering in 2015 AD,
                  Bachelor's in Automobile Engineering in 2016 AD, and M.Sc. in
                  Mechanical Design & Manufacturing in 2017 AD. The most recent
                  addition is the M.Sc. in Informatics and Intelligent Systems
                  Engineering in 2020 AD, conducted in the evening session.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </AnimatedSection>

      {/* Mission, Vision, Values Grid */}
      <AnimatedSection
        className="py-20 px-4 bg-gradient-to-r from-teal-light to-background-light"
        delay={0.3}
      >
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="text-center">
              <div className="bg-white rounded-xl shadow-xl p-8 h-full hover:shadow-2xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-accent-orange rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-accent-orange mb-4">
                  MISSION
                </h2>
                <h3 className="text-xl font-bold text-primary-blue mb-6">
                  EMPOWERING ENGINEERS FOR REAL-WORLD IMPACT
                </h3>
                <p className="text-text-dark leading-relaxed">
                  We aim to provide a transformative educational experience,
                  cultivate innovation and research, and produce highly skilled
                  engineers capable of addressing complex global challenges with
                  practical solutions.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="text-center">
              <div className="bg-white rounded-xl shadow-xl p-8 h-full hover:shadow-2xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-secondary-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-secondary-blue mb-4">
                  VISION
                </h2>
                <h3 className="text-xl font-bold text-primary-blue mb-6">
                  GLOBAL ENGINEERING EXCELLENCE
                </h3>
                <p className="text-text-dark leading-relaxed">
                  Our vision is to be a leading engineering campus globally
                  recognized for academic excellence, research, innovation, and
                  societal impact, producing engineers who shape the future.
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="text-center">
              <div className="bg-white rounded-xl shadow-xl p-8 h-full hover:shadow-2xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-accent-purple rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-accent-purple mb-4">
                  VALUES
                </h2>
                <h3 className="text-xl font-bold text-primary-blue mb-6">
                  EXCELLENCE, INNOVATION, INTEGRITY, INCLUSIVITY AND
                  SUSTAINABILITY
                </h3>
                <p className="text-text-dark leading-relaxed">
                  We uphold the principles of Excellence: Striving for the
                  highest standards in teaching, research, and student
                  development; Innovation: Encouraging creative thinking and
                  cutting-edge solutions; and fostering integrity, inclusivity,
                  and sustainability in all our endeavors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Detailed Values Section */}
      <AnimatedSection className="py-16 px-4" delay={0.4}>
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary-blue mb-12">
            Our Core Values in Detail
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Excellence",
                description:
                  "Striving for the highest standards in teaching, research, and student development",
                icon: "⭐",
                color: "bg-yellow-500",
              },
              {
                title: "Innovation",
                description:
                  "Encouraging creative thinking and cutting-edge solutions to modern challenges",
                icon: "💡",
                color: "bg-blue-500",
              },
              {
                title: "Integrity",
                description:
                  "Maintaining honesty, transparency, and ethical conduct in all our activities",
                icon: "🤝",
                color: "bg-green-500",
              },
              {
                title: "Inclusivity",
                description:
                  "Creating an environment where diversity is celebrated and everyone belongs",
                icon: "🌍",
                color: "bg-purple-500",
              },
              {
                title: "Sustainability",
                description:
                  "Promoting environmental responsibility and sustainable engineering practices",
                icon: "🌱",
                color: "bg-emerald-500",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className={`w-12 h-12 ${value.color} rounded-full flex items-center justify-center mb-4`}
                >
                  <span className="text-2xl">{value.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-primary-blue mb-3">
                  {value.title}
                </h3>
                <p className="text-text-dark">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Call to Action */}
    </div>
  );
}
