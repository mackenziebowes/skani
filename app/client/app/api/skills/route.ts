import { NextResponse } from "next/server";
import { getAllSkills } from "@/lib/data/mock-skills";

export async function GET() {
	const skills = getAllSkills();
	return NextResponse.json(skills);
}
