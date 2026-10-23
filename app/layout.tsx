import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import {
  DocsToaster,
  PreviewDirectionProvider,
} from "@/components/docs"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { siteConfig } from "@/lib/config"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-sono-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const geistMono = Geist_Mono({
  variable: "--font-sono-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="style-vega flex min-h-full flex-col font-sans text-body">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PreviewDirectionProvider>
            <TooltipProvider>
              {children}
              <DocsToaster />
            </TooltipProvider>
          </PreviewDirectionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
