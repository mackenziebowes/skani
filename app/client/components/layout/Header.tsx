"use client";

import Link from "next/link";
import { Package, FileText, Github } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package className="h-5 w-5" />
          <span>Skani</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/skills"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Skills
          </Link>
          <Link
            href="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            Docs
          </Link>
          <a
            href="https://github.com/mackenziebowes/skani"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}
