import type { MirroredSkill, MirroredSkillsIndex } from "./types";
import obraSuperpowersFull from "./obra-superpowers-full.json";
import marketingSkillsFull from "./marketing-skills-full.json";

const mirroredSkills: MirroredSkillsIndex = {
  ...obraSuperpowersFull,
  ...marketingSkillsFull,
};

export function getMirroredSkill(id: string): MirroredSkill | null {
  return mirroredSkills[id] || null;
}

export function hasMirroredSkill(id: string): boolean {
  return id in mirroredSkills;
}

export function listMirroredSkillIds(): string[] {
  return Object.keys(mirroredSkills);
}

export function getAllMirroredSkills(): MirroredSkillsIndex {
  return mirroredSkills;
}

export { mirroredSkills };
