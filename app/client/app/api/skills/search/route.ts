import { NextResponse } from "next/server";
import { searchSkillsReal } from "@/lib/data/mock-skills";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("q");
	
	if (!query) {
		return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
	}
	
	const results = await searchSkillsReal(query);
	return NextResponse.json(results);
}
