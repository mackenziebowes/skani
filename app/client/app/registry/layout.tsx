"use client";

import { Header } from "@/components/layout/Header";
import { LandingFooter as Footer } from "@/components/layout/LandingFooter";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 max-w-[1600px] mx-auto w-full flex flex-col">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
