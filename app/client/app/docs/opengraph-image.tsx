import { generateOpengraphImage } from '@/lib/opengraph-image'
import { ImageResponse } from 'next/og'

export const alt = 'Documentation - Skani'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const docsIcon = (
	<svg
		width="80"
		height="80"
		viewBox="0 0 24 24"
		fill="none"
		stroke="#d98324"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
	</svg>
)

export default async function Image() {
	return generateOpengraphImage({
		title: 'Documentation',
		subtitle: 'Everything you need to know about Skani',
		icon: docsIcon,
	})
}
