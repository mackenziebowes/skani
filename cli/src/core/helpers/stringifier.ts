import { join } from "node:path";
import { readdir, writeFile } from "node:fs/promises";
import { FileBuilder } from "./file-builder";
import { statSync } from "node:fs";
import { cwd } from "node:process";
import { config } from "../../config";

async function generateTemplateFromTs(path: string) {
  if (path.endsWith(".ts")) {
    const content = await Bun.file(path).text();
    const fb = new FileBuilder();
    const snaked_title = path
      .split("/")
      .join("_")
      .split("-")
      .join("_")
      .split(".")[0];
    if (!snaked_title)
      throw new Error(`Failed to generate identifier for path: ${path}`);
    fb.addLine(`const ${snaked_title + "_init"} = () => {`);
    fb.addLine(`const fb = new FileBuilder();`, 1);
    const lines = content.split("\n");
    for (const line of lines) {
      const cleanLine = line.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
      fb.addLine(`fb.addLine("${cleanLine}")`, 1);
    }
    fb.addLine("return fb.build();", 1);
    fb.addLine("};");
    fb.addEmptyLine();
    fb.addLine(`const ${snaked_title} = {`);
    fb.addLine(`location: "${path}",`, 1);
    fb.addLine(`content: ${snaked_title + "_init"}`, 1);
    fb.addLine(`};`);
    const out = fb.build();
    return { name: snaked_title, content: out };
  }
  return null;
}

async function generateTemplateFromMd(path: string) {
  if (path.endsWith(".md")) {
    const content = await Bun.file(path).text();
    const fb = new FileBuilder();
    const snaked_title = path
      .split("/")
      .join("_")
      .split("-")
      .join("_")
      .split(".")[0];
    if (!snaked_title)
      throw new Error(`Failed to generate identifier for path: ${path}`);
    fb.addLine(`const ${snaked_title + "_init"} = () => {`);
    fb.addLine(`const fb = new FileBuilder();`, 1);
    const lines = content.split("\n");
    for (const line of lines) {
      const cleanLine = line.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
      fb.addLine(`fb.addLine("${cleanLine}")`, 1);
    }
    fb.addLine("return fb.build();", 1);
    fb.addLine("};");
    fb.addEmptyLine();
    fb.addLine(`const ${snaked_title} = {`);
    fb.addLine(`location: "${path}",`, 1);
    fb.addLine(`content: ${snaked_title + "_init"}`, 1);
    fb.addLine(`};`);
    const out = fb.build();
    return { name: snaked_title, content: out };
  }
  return null;
}

async function generateTemplate(path: string) {
  if (path.endsWith(".ts")) {
    return generateTemplateFromTs(path);
  }
  if (path.endsWith(".md")) {
    return generateTemplateFromMd(path);
  }
  return null;
}

async function parseFolder(path: string, fb: FileBuilder) {
  const outExport: string[] = [];
  const items = await readdir(path);
  for (const item of items) {
    const relPath = join(path, item);
    const itemStat = statSync(relPath);
    if (itemStat.isDirectory()) {
      const nestedExports = await parseFolder(relPath, fb);
      outExport.push(...nestedExports);
    }
    if (item.endsWith(".ts")) {
      const template = await generateTemplate(relPath);
      if (template) {
        fb.addLine(template.content);
        fb.addEmptyLine();
        outExport.push(template.name);
      }
    }
  }
  return outExport;
}

async function exportDataTemplates() {
  const fb = new FileBuilder();
  const exportList: string[] = [];
  const dataFiles = await readdir(join(cwd(), "src", "data"));
  for (const file of dataFiles) {
    if (file == "init.ts" || file == "core.ts" || file == "index.ts") {
      continue;
    }
    const content = await Bun.file(join(cwd(), "src", "data", file)).text();
    const lines = content.split("\n");
    const exportStatement = lines.pop();
    if (!exportStatement) throw new Error(`Parsed file ${file} is empty`);
    const functionName = exportStatement.split(" ")[2];
    if (!functionName)
      throw new Error(
        `Parse file ${file} is malformed - missing export statement`,
      );
    exportList.push(functionName);
    fb.addLine(`import { ${functionName} } from "./${file}";`);
  }
  fb.addEmptyLine();
  fb.addLine("type DataExport = {");
  fb.addLine("location: string", 1);
  fb.addLine("content: () => string", 1);
  fb.addLine("};");
  fb.addEmptyLine();
  fb.addLine(`const data: DataExport[] = [${exportList.join(", ")}];`);
  fb.addLine("export { data }");
  const out = fb.build();
  await writeFile(join(cwd(), "src", "data", "index.ts"), out, "utf8");
}

async function generateTemplates() {
  for (const watchConfig of config.watchConfigs) {
    const fb = new FileBuilder();
    fb.addLine(`import { FileBuilder } from "../core/helpers/file-builder";`);
    fb.addEmptyLine();
    if (watchConfig.type == "dir") {
      const exports = await parseFolder(watchConfig.sourcePath, fb);
      fb.addLine(`const ${watchConfig.name} = [${exports.join(", ")}]`);
      fb.addLine(`export { ${watchConfig.name} }`);
      const out = fb.build();
      await writeFile(watchConfig.outputPath, out, "utf8");
    } else {
      const template = await generateTemplate(watchConfig.sourcePath);
      if (template) {
        fb.addLine(template.content);
        fb.addEmptyLine();
        fb.addLine(`export { ${template.name} }`);
        const out = fb.build();
        await writeFile(watchConfig.outputPath, out, "utf8");
      }
    }
  }
  exportDataTemplates();
}

generateTemplates();
