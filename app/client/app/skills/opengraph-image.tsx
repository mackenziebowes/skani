import { generateOpengraphImage } from '@/lib/opengraph-image'
import { ImageResponse } from 'next/og'

export const alt = 'Skills - Skani'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const skillsIcon = (
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
		<path d="m7.5 4.27 9 5.15" />
		<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
		<path d="m3.3 7 8.7 5 8.7-5" />
		<path d="M12 22V12" />
	</svg>
)

export default async function Image() {
	return generateOpengraphImage({
		title: 'Skills',
		subtitle: 'Browse and install agent skills',
		icon: skillsIcon,
	})
}
