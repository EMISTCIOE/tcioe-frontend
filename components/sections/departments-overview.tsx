import Link from "next/link"
import * as LucideIcons from "lucide-react"
import type { DepartmentsOverviewProps } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"

// Dynamically get Lucide icon component
const getIcon = (iconName: string) => {
  const IconComponent = (LucideIcons as any)[iconName]
  return IconComponent ? <IconComponent className="h-10 w-10 text-[#1A1A2E]" /> : null
}

export const DepartmentsOverview = ({ departments }: DepartmentsOverviewProps) => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-white to-light-teal">
      <div className="container mx-auto px-4 lg:px-6">
        <AnimatedSection>
          <h2 className="text-xl md:text-3xl font-bold text-center text-[#1A1A2E] mb-10">
            Our Academic Departments
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, index) => (
            <AnimatedSection key={dept.name} delay={0.1 * index}>
              <Card className="h-full flex flex-col items-center text-center p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100 transform hover:-translate-y-0.5">
                <CardHeader className="pb-3">
                  <div className="mb-3 px-6 py-3 bg-muted rounded-full flex items-center justify-center">
                    {getIcon(dept.icon)}
                  </div>
                  <CardTitle className="text-lg font-semibold text-text-dark">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-text-light text-sm mb-3 line-clamp-4">{dept.description}</p>
                </CardContent>
                <Link
                  href={dept.href}
                  className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground px-6 py-2 text-base font-semibold shadow-md transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Learn More
                </Link>
              </Card>
            </AnimatedSection>
          ))}
        </div>
        <AnimatedSection delay={0.4} className="text-center mt-10">
          <Link
            href="/departments"
            className="inline-flex h-10 items-center justify-center bg-accent-orange hover:bg-accent-orange/90 rounded-full text-white px-8 text-base font-semibold shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 transform hover:-translate-y-0.5"
          >
            View All Departments
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
