import kits from "@/lib/data/kits";
import type { Kit } from "@/lib/types/kit";

export function getKits(): Kit[] {
  return Object.values(kits);
}

export function getKitByName(name: string): Kit | undefined {
  return getKits().find((kit) => kit.environment.name === name);
}
