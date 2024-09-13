import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserProvider from "@/context/UserContext";
import { ContentSection } from "@/components/ContentSection";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "24uzr",
  description: "Optimise you 24 hour sailing race desicions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <Navbar />
          <ContentSection>
            {children}
          </ContentSection>
          <Footer/>
        </UserProvider>
      </body>
    </html>
  );
}
