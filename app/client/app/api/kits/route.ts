import { NextResponse } from "next/server";
import { MARKETING_SKILLS_FULL_KIT } from "@/data/kits";

const kits = [MARKETING_SKILLS_FULL_KIT];

export async function GET() {
  const kitList = kits.map((kit) => ({
    name: kit.environment.name,
    version: kit.version,
    created: kit.environment.created,
    updated: kit.environment.updated,
    skillCount: kit.skills.length,
  }));
  return NextResponse.json(kitList);
}
