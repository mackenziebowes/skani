"use client";

import { Header } from "@/components/layout/Header";
import { DocsNav } from "@/components/docs/DocsNav";
import { docsNavSections } from "@/lib/docs-nav";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 max-w-[1600px] mx-auto w-full flex flex-col">
      <Header />
      <div className="flex flex-1">
        <DocsNav sections={docsNavSections} />
        {children}
      </div>
    </div>
  );
}
