import { getKits } from "@/lib/api/kits";
import { KitGrid } from "@/components/kit/KitGrid";

export default function KitsPage() {
  const kits = getKits();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Available Kits - Skani",
    description: "Browse and install skill kits from the central registry",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Kits</h1>
          <p className="text-muted-foreground">
            Pre-configured skill bundles for rapid setup
          </p>
        </div>
        <KitGrid kits={kits} />
      </div>
    </>
  );
}
