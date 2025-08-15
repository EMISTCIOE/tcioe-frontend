import { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import DepartmentLandingPage from "@/components/sections/department_landing";
import { generateSEOMetadata } from "@/components/SEO";
import { departmentSEOConfig } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";

export const metadata: Metadata = generateSEOMetadata({
  title: departmentSEOConfig["automobile-mechanical"].title,
  description: departmentSEOConfig["automobile-mechanical"].description,
  keywords: departmentSEOConfig["automobile-mechanical"].keywords,
  url: "/departments/automobile-mechanical",
});

const data = {
  departmentName: "Department of Automobile Mechanical Engineering",
  bannerImage: "/data/hero.webp",
  departmentDescription:
    "The Department of Automobile Mechanical Engineering at our institution focuses on innovation, practical learning, and academic excellence. We aim to equip students with the skills needed to excel in the rapidly evolving fields of automobile and mechanical engineering. Our curriculum integrates theoretical knowledge with hands-on experience, preparing graduates for successful careers in various industries. We are committed to fostering a culture of research and development, encouraging students to engage in projects that address real-world challenges. Our faculty comprises experienced professionals dedicated to mentoring and guiding students through their academic journey.",
  departmentPhoto: "/data/hero.webp",
  hodMessage:
    "Welcome to the Department of Automobile Mechanical Engineering. We are committed to fostering excellence in teaching and innovation. Our mission is to prepare our students for the challenges of the future through a robust curriculum and hands-on experience. We encourage our students to explore, innovate, and contribute to the field of engineering. Together, we can shape the future of automobile and mechanical engineering. Here, we believe in the power of engineering to transform lives and communities.",
  hodName: "Er. UKG",
  hodPhoto: "/data/ukg_doece.webp",
  events: [
    {
      title: "Tech Talk: AI & Future",
      date: "July 25, 2025",
      description:
        "A session on the future of Artificial Intelligence in modern industry.",
    },
    {
      title: "Hackathon 2025",
      date: "August 10-11, 2025",
      description:
        "48-hour coding competition focused on real-world problem-solving.",
    },
  ],
};

// Structured data for the department
const departmentSchema = {
  "@context": "https://schema.org",
  "@type": "CollegeDepartment",
  name: "Department of Automobile Mechanical Engineering",
  description: data.departmentDescription,
  url: `${process.env.NEXT_PUBLIC_BASE_URL}/departments/automobile-mechanical`,
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "Tribhuvan University Institute of Engineering, Thapathali Campus",
    url: process.env.NEXT_PUBLIC_BASE_URL,
  },
  employee: {
    "@type": "Person",
    name: data.hodName,
    jobTitle: "Head of Department",
    image: `${process.env.NEXT_PUBLIC_BASE_URL}${data.hodPhoto}`,
  },
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "Bachelor of Automobile Engineering",
      educationalLevel: "Undergraduate",
      credentialCategory: "degree",
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "Bachelor of Mechanical Engineering",
      educationalLevel: "Undergraduate",
      credentialCategory: "degree",
    },
  ],
};

export default function AutomobileMechanicalPage() {
  return (
    <AnimatedSection className="text-center">
      <StructuredData data={departmentSchema} />
      <DepartmentLandingPage {...data} />
    </AnimatedSection>
  );
}
