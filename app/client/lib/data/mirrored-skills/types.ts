export interface MirroredSkill {
  id: string;
  source: {
    owner: string;
    repo: string;
    ref: string;
    path: string;
  };
  files: Record<string, string>;
  mirroredAt: string;
}

export interface MirroredSkillsIndex {
  [skillId: string]: MirroredSkill;
}
