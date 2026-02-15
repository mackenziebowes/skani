import log from "./log";
import { join } from "node:path";
import { config } from "../config";

export type Command = {
  name: string;
  subcommand?: string;
  description: string;
  instructions: string;
  run: (args: string[]) => Promise<void> | void;
};

const commands = new Map<string, Command>();

export function registerCommand(cmd: Command) {
  const key = cmd.subcommand ? `${cmd.name}:${cmd.subcommand}` : cmd.name;
  commands.set(key, cmd);
}

export async function runCLI(argv = Bun.argv.slice(2)) {
  const [name, ...args] = argv;
  // -- TS Defense --
  if (!name) {
    log.single.err("ARGS", "No Argument Supplied");
    return;
  }
  if (["-h", "--help"].includes(name)) {
    const multiLog: any[] = [];
    multiLog.push({
      t: "About",
      m: config.about_text,
    });
    multiLog.push({
      t: "Commands",
      m: "Available Commands",
    });
    // Group commands by name
    const grouped = new Map<string, Command[]>();
    for (const cmd of commands.values()) {
      if (!grouped.has(cmd.name)) {
        grouped.set(cmd.name, []);
      }
      grouped.get(cmd.name)!.push(cmd);
    }
    
    // Display commands
    for (const [name, cmds] of grouped) {
      const mainCmd = cmds[0];
      if (mainCmd.subcommand) {
        // Group of subcommands
        multiLog.push({
          t: name,
          m: `${cmds.length} subcommand(s) available\n${cmds.map((c, i) => `  |->  [${c.subcommand}]: ${c.description}`).join('\n')}\n`,
        });
      } else {
        // Simple command
        multiLog.push({
          t: name,
          m: `${mainCmd.description}\n  |->  [Instructions]: ${mainCmd.instructions}\n`,
        });
      }
    }
    multiLog.push({
      t: "More Info",
      m: config.more_info_text,
    });
    log.multi.info(multiLog);
    return;
  }

  if (["-v", "--version"].includes(name)) {
    const pkgPath = join(import.meta.dir, "..", "package.json");
    const pkgText = await Bun.file(pkgPath).text();
    const pkg = JSON.parse(pkgText);
    log.multi.info([
      {
        t: "Package Name",
        m: pkg.name,
      },
      {
        t: "Package Version",
        m: pkg.version,
      },
    ]);
    return;
  }

  let command: Command | undefined;
  
  // Try to find by exact match first (for simple commands like "install")
  command = commands.get(name);
  
  // If not found and we have args, try subcommand lookup (for "kit list")
  if (!command && args.length > 0) {
    const subcommand = args[0];
    const subcommandKey = `${name}:${subcommand}`;
    command = commands.get(subcommandKey);
  }
  
  if (!command) {
    log.single.err("Command", "No Command Supplied");
    process.exit(1);
  }

  try {
    // For subcommands, remove the subcommand from args
    const runArgs = command.subcommand ? args.slice(1) : args;
    await command.run(runArgs);
  } catch (err) {
    const multilog: any[] = [];
    multilog.push({
      t: "Panic",
      m: `Failed to run ${name}`,
    });
    if (err instanceof Error) {
      multilog.push({
        t: "Error",
        m: err.message,
      });
    } else {
      multilog.push({
        t: "Unknown Error",
        m: JSON.stringify(err),
      });
    }
    log.multi.err(multilog);
    process.exit(1);
  }
}
