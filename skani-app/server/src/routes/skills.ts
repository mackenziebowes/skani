import { Hono } from "hono";
import { mockSkills, searchSkills, getSkillById, getAllSkills } from "../data/mock-skills";

export const skillsRoute = new Hono();

skillsRoute.get("/", (c) => {
	const skills = getAllSkills();
	return c.json(skills);
});

skillsRoute.get("/search", (c) => {
	const query = c.req.query("q");
	
	if (!query) {
		return c.json({ error: "Query parameter 'q' is required" }, 400);
	}
	
	const results = searchSkills(query);
	return c.json(results);
});

skillsRoute.get("/:id", (c) => {
	const id = c.req.param("id");
	const skill = getSkillById(id);
	
	if (!skill) {
		return c.json({ error: "Skill not found" }, 404);
	}
	
	return c.json(skill);
});
