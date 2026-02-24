import { NextResponse } from "next/server";
import kits from "@/lib/data/kits";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const kit = Object.values(kits).find((k) => k.environment.name === name);

  if (!kit) {
    return NextResponse.json({ error: "Kit not found" }, { status: 404 });
  }

  return NextResponse.json(kit);
}
