## Basic idea:

Agent Skills work best when tightly skilled to their dev environment.

There are a lot of different dev environments.

This precludes the generic "global skill store" option for most use cases - having access to a big pile of *everything* can degrade Agent Coding performance because it can be confused about which skill to pull.

Additionally, developers may want to share environments between devices (especially, for example, temporary devices on ec2/sub-agent sandboxes).

So, there needs to be a reproducible way to configure agent skill environments.

## Features

1) NPX command that:
	1) Fetches skills from a central repository, or
	2) From a skills repository on, say, github, and
	3) Marks down in a file, `skani.json`, that this skill has been installed to the local environment.
	4) Can be run on a `skani.json` to install skills in a new environment
2) Website that:
	1) Lists available skills, with
	2) copyable commands to install individual skills.
	3) Documents usage, the `skani.json` structure, etc.
