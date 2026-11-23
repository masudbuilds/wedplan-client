import * as React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { SiteLayout } from "@/components/site-layout"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "WedPlan | Curated Wedding Services & Planning Marketplace",
  description:
    "Discover premier wedding photographers, venues, florists, and artisans. Seamlessly manage bookings, vendor portfolios, and celebrations.",
  icons: {
    icon: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
          <SiteLayout>{children}</SiteLayout>
        </React.Suspense>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
