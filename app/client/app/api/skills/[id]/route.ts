import { NextResponse } from "next/server";
import { getSkillById } from "@/lib/data/mock-skills";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	const skill = getSkillById(id);
	
	if (!skill) {
		return NextResponse.json({ error: "Skill not found" }, { status: 404 });
	}
	
	return NextResponse.json(skill);
}
