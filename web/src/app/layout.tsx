import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ContentSection } from "@/components/ContentSection"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "24uzr",
  description: "Optimize you 24 hour sailing race decisions.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <ContentSection>
          {children}
        </ContentSection>
        <Footer/>
      </body>
    </html>
  )
}
