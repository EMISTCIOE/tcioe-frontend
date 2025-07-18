import Image from "next/image"
import type { CampusChiefMessageProps } from "@/types"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/animated-section"
import { useState } from "react"

export const CampusChiefHeroMessage = ({ name, title, image, message, fullMessage }: CampusChiefMessageProps) => {
  const [buttonText, setButtonText] = useState("Read Full Message")
  const [extendedMessage, setExtendedMessage] = useState<string | undefined>(". . .")
  const handleButtonClick = () => {
   buttonText === "Read Full Message"? setButtonText("Close Full Message") : setButtonText("Read Full Message")
    extendedMessage === ". . ." ? setExtendedMessage(fullMessage) : setExtendedMessage(". . .")
  }
  return (
    <section className="py-12 md:py-20 bg-wheat-light">
      <div className="container mx-auto px-4 lg:px-6">
        <AnimatedSection>
          <h2 className="text-xl md:text-3xl font-bold text-center text-primary-blue mb-10">
            Message from the Campus Chief
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              width={160}
              height={160}
              className="rounded-[30%] object-cover aspect-square border-3 border-primary-blue shadow-md flex-shrink-0"
            />
            <div className="text-center md:text-left flex-1">
              <h3 className="text-xl font-semibold text-text-dark">{name}</h3>
              <p className="text-base text-text-light mb-3">{title}</p>
              <p className="text-sm text-text-dark leading-relaxed mb-4">
                {message}
                {fullMessage && (
                  <>
                    {" "}
                    {/* <span className="hidden md:inline">{fullMessage}</span>
                    <span className="md:hidden">...</span> */}
                    <span>{extendedMessage}</span>
                  </>
                )}
              </p>
              {fullMessage && (
                <Button
                  onClick={handleButtonClick}
                  variant="outline"
                  className="text-primary-blue border-primary-blue hover:bg-primary-blue hover:text-white transition-colors bg-transparent rounded-md px-5 py-1.5 text-sm shadow-sm hover:shadow-md"
                >
                  {buttonText}
                </Button>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
