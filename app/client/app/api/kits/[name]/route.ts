import { NextResponse } from "next/server";
import { MARKETING_SKILLS_FULL_KIT } from "@/lib/data/kits";

const kits = [MARKETING_SKILLS_FULL_KIT];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const kit = kits.find((k) => k.environment.name === name);

  if (!kit) {
    return NextResponse.json({ error: "Kit not found" }, { status: 404 });
  }

  return NextResponse.json(kit);
}
