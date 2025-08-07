import { AnimatedSection } from "@/components/animated-section"
import DepartmentLandingPage from "@/components/sections/department_landing"

const data = {
  "departmentName": "Department of Applied Science",
  "bannerImage": "/data/hero.webp",
  "departmentDescription": "The Department of Applied Science at our institution focuses on innovation, practical learning, and academic excellence. We aim to equip students with the skills needed to excel in the rapidly evolving fields of applied science and technology. Our curriculum integrates theoretical knowledge with hands-on experience, preparing graduates for successful careers in various industries. We are committed to fostering a culture of research and development, encouraging students to engage in projects that address real-world challenges. Our faculty comprises experienced professionals dedicated to mentoring and guiding students through their academic journey.",
  "departmentPhoto": "/data/hero.webp",
  "hodMessage": "Welcome to the Department of Applied Science. We are committed to fostering excellence in teaching and innovation. Our mission is to prepare our students for the challenges of the future through a robust curriculum and hands-on experience. We encourage our students to explore, innovate, and contribute to the field of technology. Together, we can shape the future of applied science. Here, we believe in the power of technology to transform lives and communities.",
  "hodName": "Er. Baldev",
  "hodPhoto": "/data/baldev_das.webp",
  "events": [
    {
      "title": "Talk on Quantum Computing",
      "date": "July 25, 2025",
      "description": "A session on the future of Quantum Computing in modern industry."
    },
    {
      "title": "Science Fair 2025",
      "date": "August 10-11, 2025",
      "description": "A showcase of innovative projects and research by students."
    }
  ]
}


export default function AppliedSciencePage() {
  return (
    <AnimatedSection className="text-center">
      <DepartmentLandingPage {...data} />
    </AnimatedSection>
  )
}