import type { Kit } from "@/lib/types/kit";
import { KitCard } from "./KitCard";

interface KitGridProps {
  kits: Kit[];
}

export function KitGrid({ kits }: KitGridProps) {
  if (kits.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No kits available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kits.map((kit) => (
        <KitCard key={kit.environment.name} kit={kit} />
      ))}
    </div>
  );
}
