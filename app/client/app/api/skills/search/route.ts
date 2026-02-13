import { NextResponse } from "next/server";
import { searchSkills } from "@/lib/data/mock-skills";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("q");
	
	if (!query) {
		return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
	}
	
	const results = searchSkills(query);
	return NextResponse.json(results);
}
