export interface KitSkill {
  id: string;
  name: string;
  version: string;
  source: {
    url: string;
    type: string;
    owner: string;
    repo: string;
    ref: string;
    path: string;
  };
  installedAt: string;
}

export interface Kit {
  version: string;
  environment: {
    name: string;
    created: string;
    updated: string;
  };
  skills: KitSkill[];
}
