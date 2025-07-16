import type { CampusChiefMessageProps } from "@/types"
import { LeadershipMessageCard } from "./leadership-message-card"
import { AnimatedSection } from "@/components/animated-section"

interface HoDMessagesSectionProps {
  messages: CampusChiefMessageProps[]
  title: string
}

export const HoDMessagesSection = ({ messages, title }: HoDMessagesSectionProps) => {
  if (!messages || messages.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-white to-teal-light">
      <div className="container mx-auto px-4 lg:px-6">
        <AnimatedSection>
          <h2 className="text-xl md:text-3xl font-bold text-center text-primary-blue mb-10">{title}</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((message, index) => (
            <AnimatedSection key={message.name} delay={0.1 * index}>
              <LeadershipMessageCard {...message} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
