import { NextResponse } from "next/server";
import kits from "@/lib/data/kits";

export async function GET() {
  const kitList = Object.values(kits).map((kit) => ({
    name: kit.environment.name,
    version: kit.version,
    created: kit.environment.created,
    updated: kit.environment.updated,
    skillCount: kit.skills.length,
  }));
  return NextResponse.json(kitList);
}
