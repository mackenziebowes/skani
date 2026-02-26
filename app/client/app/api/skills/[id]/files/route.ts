import { NextResponse } from "next/server";
import { getMirroredSkill, hasMirroredSkill } from "@/lib/data/mirrored-skills";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!hasMirroredSkill(id)) {
    return NextResponse.json(
      { error: "Skill files not found in registry", mirrored: false },
      { status: 404 }
    );
  }

  const skill = getMirroredSkill(id);
  if (!skill) {
    return NextResponse.json(
      { error: "Skill not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: skill.id,
    source: skill.source,
    files: skill.files,
    mirroredAt: skill.mirroredAt,
    mirrored: true,
  });
}
