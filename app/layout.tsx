import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tribhuvan University Institute of Engineering, Thapathali Campus",
  description:
    "Official website for Tribhuvan University Institute of Engineering, Thapathali Campus. Providing quality engineering and architectural education.",
  keywords: ["Thapathali Campus", "IOE", "Tribhuvan University", "Engineering College Nepal", "Architecture Nepal"],
  openGraph: {
    title: "Tribhuvan University Institute of Engineering, Thapathali Campus",
    description:
      "Official website for Tribhuvan University Institute of Engineering, Thapathali Campus. Providing quality engineering and architectural education.",
    url: "https://www.thapathalicampus.edu.np", // Replace with actual domain
    siteName: "Thapathali Campus",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200", // Placeholder for OG image
        width: 1200,
        height: 630,
        alt: "Thapathali Campus",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tribhuvan University Institute of Engineering, Thapathali Campus",
    description:
      "Official website for Tribhuvan University Institute of Engineering, Thapathali Campus. Providing quality engineering and architectural education.",
    images: ["/placeholder.svg?height=630&width=1200"], // Placeholder for Twitter image
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
