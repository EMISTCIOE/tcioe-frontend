import Link from "next/link"
import Image from "next/image"
import type { NewsEventsProps } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"

export const NewsEvents = ({ news }: NewsEventsProps) => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-white to-teal-light">
      <div className="container mx-auto px-4 lg:px-6">
        <AnimatedSection>
          <h2 className="text-xl md:text-3xl font-bold text-center text-primary-blue mb-10">Latest News & Updates</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.slice(0, 3).map((item, index) => (
            <AnimatedSection key={item.id} delay={0.1 * index}>
              <Card className="h-full flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 transform hover:-translate-y-0.5">
                {item.image && (
                  <div className="relative w-full h-40">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-xl"
                    />
                  </div>
                )}
                <CardHeader className="p-4 pb-2">
                  <CardDescription className="text-xs text-text-light mb-1">
                    {item.date} | {item.category}
                  </CardDescription>
                  <CardTitle className="text-base font-semibold text-text-dark line-clamp-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-4 flex-grow">
                  <p className="text-sm text-text-dark line-clamp-3">{item.excerpt}</p>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button
                    asChild
                    variant="link"
                    className="text-primary-blue hover:text-secondary-blue p-0 h-auto text-sm"
                  >
                    <Link href={`/news/${item.id}`}>Read More</Link>
                  </Button>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
        <AnimatedSection delay={0.4} className="text-center mt-10">
          <Button
            asChild
            className="bg-accent-orange hover:bg-accent-orange/90 text-white px-6 py-2 text-base rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Link href="/news">View All News</Link>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  )
}
