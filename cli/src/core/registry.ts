import type { InstalledSkill, SkaniEnvironment } from "../types/skill";

const REGISTRY_URL = "https://skani.mackenziebowes.com";

export interface RemoteKit {
  name: string;
  version: string;
  created: string;
  updated: string;
  skillCount: number;
}

export interface FullKit {
  version: string;
  environment: SkaniEnvironment;
  skills: InstalledSkill[];
}

export async function listRemoteKits(): Promise<RemoteKit[]> {
  const response = await fetch(`${REGISTRY_URL}/api/kits`);
  if (!response.ok) {
    throw new Error(`Failed to fetch kits: ${response.statusText}`);
  }
  return (await response.json()) as RemoteKit[];
}

export async function getKitByName(name: string): Promise<FullKit> {
  const response = await fetch(`${REGISTRY_URL}/api/kits/${name}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Kit not found: ${name}`);
    }
    throw new Error(`Failed to fetch kit: ${response.statusText}`);
  }
  return (await response.json()) as FullKit;
}
