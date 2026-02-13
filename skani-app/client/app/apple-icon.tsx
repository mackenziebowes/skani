import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#050505',
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 240 240"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <g>
            <path
              d="M120,226.8l106.8,-53.4l0,-106.8l-106.8,53.4l0,106.8Z"
              style={{
                fill: 'none',
                stroke: '#D98324',
                strokeWidth: '6px',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              }}
            />
            <path
              d="M13.2,173.4l0,-106.8l106.8,53.4l0,106.8l-106.8,-53.4Z"
              style={{
                fill: 'none',
                stroke: '#D98324',
                strokeWidth: '6px',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              }}
            />
            <path
              d="M13.2,66.6l106.8,-53.4l106.8,53.4l-106.8,53.4l-106.8,-53.4Z"
              style={{
                fill: 'none',
                stroke: '#D98324',
                strokeWidth: '6px',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              }}
            />
            <path
              d="M64.931,90.519l103.462,-52.287"
              style={{
                fill: 'none',
                stroke: '#D98324',
                strokeWidth: '6px',
                strokeLinecap: 'round',
              }}
            />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  )
}