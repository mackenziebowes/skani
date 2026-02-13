import Link from "next/link";

const footerLinks = {
  product: [
    { label: "CLI Tool", href: "/docs/cli-commands" },
    { label: "Manifest Standard", href: "/docs/skani-json" },
    { label: "Enterprise", href: "#" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "GitHub", href: "https://github.com/mackenziebowes/skani" },
    { label: "Community", href: "#" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

const thisYear = () => {
  const now = new Date().getFullYear();
  return now;
};

export function LandingFooter() {
  return (
    <footer className="border-t border-border py-20">
      <div className="container mx-auto px-10">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-10">
          <div>
            <h4 className="font-serif text-3xl mb-6">Skani</h4>
            <p className="text-sm text-muted-foreground -mt-2">
              © {thisYear()} Mackenzie Bowes.
              <br />
              Preserving future of AI.
            </p>
          </div>
          {Object.entries(footerLinks).map(([key, links]) => (
            <div key={key}>
              <h5 className="text-xs uppercase tracking-[0.05em] text-muted-foreground mb-6">
                {key}
              </h5>
              <ul className="list-none">
                {links.map((link, idx) => (
                  <li
                    key={`landing-footer-${idx}-${link.href}`}
                    className="mb-3"
                  >
                    <Link
                      href={link.href}
                      className="text-foreground text-sm no-underline transition-colors hover:text-primary"
                      target={
                        link.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        link.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
