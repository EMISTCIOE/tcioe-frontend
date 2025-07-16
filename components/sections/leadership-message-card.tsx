import Image from "next/image"
import type { CampusChiefMessageProps } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const LeadershipMessageCard = ({ name, title, image, message }: CampusChiefMessageProps) => {
  return (
    <Card className="h-full flex flex-col rounded-lg shadow-md border border-gray-100 transform hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-3 p-4 pb-3">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={80} // Smaller image size
          height={80} // Smaller image size
          className="rounded-[30%] object-cover aspect-square border-3 border-primary-blue shadow-sm flex-shrink-0"
        />
        <div className="flex flex-col">
          <CardTitle className="text-lg font-semibold text-text-dark">{name}</CardTitle>
          <p className="text-sm text-text-light">{title}</p>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-grow">
        <p className="text-sm text-text-dark leading-relaxed line-clamp-4">{message}</p>
      </CardContent>
    </Card>
  )
}
