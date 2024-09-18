import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserProvider from "@/context/UserContext";
import { ContentSection } from "@/components/ContentSection";
import { getUser } from "@/lib/session";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "24uzr",
  description: "Optimise you 24 hour sailing race decisions.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user = await getUser()
  console.log(`RootLayout`, user)
  
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
