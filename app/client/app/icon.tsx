import { ImageResponse } from 'next/og'
import { Package } from 'lucide-react'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#050505',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#d98324',
          borderRadius: '6px',
        }}
      >
        <Package size={20} />
      </div>
    ),
    { ...size }
  )
}
