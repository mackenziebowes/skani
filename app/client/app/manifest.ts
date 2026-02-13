import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Skani - Agent Skills Management',
    short_name: 'Skani',
    description: 'Manage and share agent skills across development environments',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#d98324',
    icons: [
      {
        src: '/icon?<generated>',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon?<generated>',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
