import type { QuickStatsProps } from "@/types"
import * as LucideIcons from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"

// Dynamically get Lucide icon component
const getIcon = (iconName: string) => {
  const IconComponent = (LucideIcons as any)[iconName]
  return IconComponent ? <IconComponent className="h-8 w-8 text-accent-orange" /> : null
}

export const QuickStats = ({ stats }: QuickStatsProps) => {
  return (
    <section className="py-12 md:py-20 bg-wheat-light">
      <div className="container mx-auto px-4 lg:px-6">
        <AnimatedSection>
          <h2 className="text-xl md:text-3xl font-bold text-center text-[#1A1A2E] mb-10">
            Our Achievements in Numbers
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <AnimatedSection key={stat.label} delay={0.1 * index}>
              <div className="bg-white p-5 rounded-xl shadow-lg flex flex-col items-center text-center h-full border border-gray-100 transform hover:-translate-y-0.5 transition-all duration-300">
                <div className="mb-3 p-2 bg-accent-orange/15 rounded-full">{getIcon(stat.icon)}</div>
                <p className="text-3xl font-bold text-primary-blue mb-1">{stat.value}</p>
                <h3 className="text-base font-semibold text-text-dark">{stat.label}</h3>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
