import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-8 mt-auto">
      <div className="container mx-auto px-6 lg:px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Skani - Agent Skills Management
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-xs sm:text-sm text-muted-foreground">
            <Link href="/docs" className="hover:text-foreground py-1 md:py-0">
              Documentation
            </Link>
            <Link href="/skills" className="hover:text-foreground py-1 md:py-0">
              Skills
            </Link>
            <a
              href="https://github.com/mackenziebowes/skani"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground py-1 md:py-0"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
