import { AnimatedSection } from "@/components/animated-section"
import DepartmentLandingPage from "@/components/sections/department_landing"

const data = {
  "departmentName": "Department of Architecture",
  "bannerImage": "/data/hero.webp",
  "departmentDescription": "The Department of Architecture at our institution focuses on innovation, practical learning, and academic excellence. We aim to equip students with the skills needed to excel in the rapidly evolving fields of architecture and design. Our curriculum integrates theoretical knowledge with hands-on experience, preparing graduates for successful careers in various industries. We are committed to fostering a culture of research and development, encouraging students to engage in projects that address real-world challenges. Our faculty comprises experienced professionals dedicated to mentoring and guiding students through their academic journey.",
  "departmentPhoto": "/data/hero.webp",
  "hodMessage": "Welcome to the Department of Architecture. We are committed to fostering excellence in teaching and innovation. Our mission is to prepare our students for the challenges of the future through a robust curriculum and hands-on experience. We encourage our students to explore, innovate, and contribute to the field of architecture. Together, we can shape the future of architecture and design. Here, we believe in the power of design to transform lives and communities.",
  "hodName": "Ar. Shova Thapa",
  "hodPhoto": "/data/shova_doarch.webp",
  "events": [
    {
      "title": "Design Symposium 2025",
      "date": "July 25, 2025",
      "description": "A session on the future of design in modern industry."
    },
    {
      "title": "Exhibition of Student Projects",
      "date": "August 10-11, 2025",
      "description": "A showcase of innovative projects and research by students."
    }
  ]
}


export default function ArchitecturePage() {
  return (
    <AnimatedSection className="text-center">
      <DepartmentLandingPage {...data} />
    </AnimatedSection>
  )
}