import type { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://skani.mackenziebowes.com'
const APP_DIR = path.join(process.cwd(), 'app')

function getAppRoutes(dir: string, basePath: string = ''): string[] {
  const routes: string[] = []

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name.startsWith('(')) continue
    if (entry.name === 'api') continue
    if (entry.name.includes('[')) continue

    const fullPath = path.join(dir, entry.name)
    const routePath = basePath ? `${basePath}/${entry.name}` : entry.name

    if (entry.isDirectory()) {
      if (fs.existsSync(path.join(fullPath, 'page.tsx')) ||
          fs.existsSync(path.join(fullPath, 'page.ts'))) {
        routes.push(routePath)
      }
      routes.push(...getAppRoutes(fullPath, routePath))
    }
  }

  return routes
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = getAppRoutes(APP_DIR)

  const pages = routes.map((route) => ({
    url: `${BASE_URL}/${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
    ...pages,
  ]
}
