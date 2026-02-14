import { NextResponse } from "next/server";
import { getAllSkillsReal } from "@/lib/data/mock-skills";

export async function GET() {
	const skills = await getAllSkillsReal();
	return NextResponse.json(skills);
}
