import { NextRequest } from 'next/server'
import { generateOpengraphImage } from '@/lib/opengraph-image'
import { ImageResponse } from 'next/og'

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)
	const title = searchParams.get('title') || 'Skani'
	const subtitle = searchParams.get('subtitle') || undefined
	const accent = searchParams.get('accent') || '#d98324'
	const background = searchParams.get('background') || '#050505'
	const showGrid = searchParams.get('grid') === 'true'

	return generateOpengraphImage({
		title,
		subtitle,
		accent,
		background,
	})
}
