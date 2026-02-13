#!/usr/bin/env bun
import { readdirSync, statSync, writeFileSync } from "fs";
import { join, relative, dirname } from "path";

const APP_DIR = "app";
const PUBLIC_DIR = "public";
const BASE_URL = "https://skani.dev";
const SITEMAP_PATH = join(PUBLIC_DIR, "sitemap.xml");

interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
}

const pagePriorities: Record<string, number> = {
  "/": 1.0,
  "/landing": 0.9,
  "/docs": 0.9,
  "/skills": 0.8,
  "/docs/cli-commands": 0.8,
  "/docs/getting-started": 0.8,
  "/docs/skani-json": 0.7,
};

function getPagePriority(path: string): number {
  return pagePriorities[path] || 0.6;
}

function getChangeFrequency(path: string): string {
  if (path === "/" || path === "/landing") return "weekly";
  if (path.startsWith("/docs")) return "monthly";
  if (path.startsWith("/skills")) return "daily";
  return "monthly";
}

function findPageFiles(dir: string, baseDir: string = APP_DIR): string[] {
  const pages: string[] = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        pages.push(...findPageFiles(fullPath, baseDir));
      } else if (entry === "page.tsx") {
        pages.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`Skipping ${dir}: ${error}`);
  }

  return pages;
}

function pathToUrl(filePath: string): string | null {
  const relativePath = relative(APP_DIR, dirname(filePath));
  
  if (relativePath === APP_DIR) {
    return "/";
  }

  const segments = relativePath.split("/");
  const urlSegments: string[] = [];

  for (const segment of segments) {
    if (segment.startsWith("[") && segment.endsWith("]")) {
      return null;
    }
    urlSegments.push(segment);
  }

  return "/" + urlSegments.join("/");
}

function generateSitemap(): void {
  console.log("Scanning for pages...");
  const pageFiles = findPageFiles(APP_DIR);
  console.log(`Found ${pageFiles.length} pages`);

  const entries: SitemapEntry[] = [];
  const now = new Date().toISOString();

  for (const pageFile of pageFiles) {
    const urlPath = pathToUrl(pageFile);
    if (urlPath === null) {
      console.log(`  Skipping dynamic route: ${relative(APP_DIR, dirname(pageFile))}`);
      continue;
    }

    const entry: SitemapEntry = {
      url: BASE_URL + urlPath,
      lastModified: now,
      changeFrequency: getChangeFrequency(urlPath),
      priority: getPagePriority(urlPath),
    };

    entries.push(entry);
    console.log(`  ${entry.url}`);
  }

  const xml = generateXml(entries);
  
  try {
    writeFileSync(SITEMAP_PATH, xml);
    console.log(`\n✅ Sitemap generated at ${SITEMAP_PATH}`);
  } catch (error) {
    console.error(`❌ Failed to write sitemap: ${error}`);
    process.exit(1);
  }
}

function generateXml(entries: SitemapEntry[]): string {
  const urlEntries = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

generateSitemap();