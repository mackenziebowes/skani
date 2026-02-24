import Link from "next/link";
import type { Kit } from "@/lib/types/kit";

interface KitCardProps {
  kit: Kit;
}

export function KitCard({ kit }: KitCardProps) {
  return (
    <Link href={`/registry/kits/${kit.environment.name}`}>
      <div className="group rounded-lg border bg-card p-6 hover:border-primary transition-colors">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold group-hover:text-primary">{kit.environment.name}</h3>
          <span className="text-xs font-mono bg-muted px-2 py-1 rounded">v{kit.version}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{kit.skills.length} skills</span>
          <span>•</span>
          <span>Updated {new Date(kit.environment.updated).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
