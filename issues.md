# cli/src

- ID field in skani.json is set to `owner-repo` - causes overwrites if skills are in the same repo. This is a very common pattern! We need to fix this immediately.
  - We should include the skill name in the id field for an installed skill.
- The cli *should* just parse normal github links to a skill folder. It's silly that we have to rewrite them to a github:owner/repo spec to target a specific skill. 
  - We should be able to natively parse links like `https://github.com/obra/superpowers/tree/main/skills/test-driven-development`
  - and `https://github.com/obra/superpowers/tree/main/skills/brainstorming`
  - These should *both* install!

# app/client

**app/client/app/docs/getting-started/page.tsx**
The content is kind of airy and fruity here. Please use a more direct, technical tone for all copy:
`Before extracting intelligence, ensure your environment meets
the minimum biological requirements. Skani requires one of the
following runtimes to be fossilized in your system path:`

This sounds insane. It should read:
`Before using Skani, your local environment needs to be prepared. Skani requires one of the following runtimes to be in your system path:`

**app/client/lib/data/mock-skills.ts**
We have mock skills! We need to figure out a way to vampire `https://skills.sh` for top skills and include them in our data.
