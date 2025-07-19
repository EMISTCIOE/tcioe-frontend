 import Link from "next/link"
import * as LucideIcons from "lucide-react"
import type { QuickLinksSectionProps } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"

// Dynamically get Lucide icon component
const getIcon = (iconName: string) => {
  const IconComponent = (LucideIcons as any)[iconName]
  return IconComponent ? <IconComponent className="h-8 w-8 text-accent-orange" /> : null
}

export const QuickLinksSection = ({ links }: QuickLinksSectionProps) => {
  if (!links || links.length === 0) {
    return null
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-white to-teal-light">
      <div className="container mx-auto px-4 lg:px-6">
        <AnimatedSection>
          <h2 className="text-2xl md:text-4xl font-bold text-center text-primary-blue mb-12">Quick Links</h2>
        </AnimatedSection>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {links.map((link, index) => (
            <AnimatedSection key={link.label} delay={0.05 * index}>
              <Link href={link.href} className="block">
                <Card className="h-full flex flex-col items-center text-center p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 transform hover:-translate-y-1">
                  <CardContent className="flex flex-col items-center justify-center p-0">
                    <div className="mb-3 p-2 bg-accent-orange/15 rounded-full">{getIcon(link.icon)}</div>
                    <p className="text-base font-semibold text-text-dark">{link.label}</p>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
