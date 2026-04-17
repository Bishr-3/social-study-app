import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'فخورون بالإمارات 🇦🇪',
    short_name: 'فخورون',
    description: 'فعالية فخورون بالإمارات - المدرسة الأهلية الخيرية',
    start_url: '/',
    display: 'standalone',
    background_color: '#050510',
    theme_color: '#CE1126',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
