import Link from "next/link";

interface NavSection {
  title: string;
  links: { label: string; href: string }[];
}

interface DocsNavProps {
  sections: NavSection[];
  activeSection?: string;
  activeLink?: string;
}

export function DocsNav({ sections, activeSection, activeLink }: DocsNavProps) {
  return (
    <aside className="hidden lg:block w-64 sticky top-20 h-[calc(100vh-80px)] border-r border-border overflow-y-auto py-12 pr-6">
      <div className="space-y-10">
        {sections.map((section, index) => (
          <div key={`docs-nav-div-${index}-${section.title}`}>
            <h5 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-6 pl-4">
              {section.title}
            </h5>
            <ul className="space-y-1">
              {section.links.map((link, index) => (
                <li key={`docs-nav-li-${index}-${link.href}`}>
                  <Link
                    href={link.href}
                    className={`block pl-4 py-2 text-sm border-l transition-colors ${
                      link.href === activeLink
                        ? "text-primary font-medium border-primary bg-primary/20"
                        : "text-gray-400 hover:text-white border-transparent hover:border-gray-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
