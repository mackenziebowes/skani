'use client'

import { useState } from 'react'
import { generateOpengraphImage, type OpengraphProps } from '@/lib/opengraph-image'

export default function TestOpengraphPage() {
	const [title, setTitle] = useState('Skani')
	const [subtitle, setSubtitle] = useState('Agent Skills Management')
	const [accent, setAccent] = useState('#d98324')
	const [background, setBackground] = useState('#050505')
	const [showGrid, setShowGrid] = useState(true)

	const imageUrl = `/api/opengraph-test?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}&accent=${encodeURIComponent(accent)}&background=${encodeURIComponent(background)}&grid=${showGrid}`

	return (
		<div className="min-h-screen bg-background p-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="font-serif text-4xl mb-8">OpenGraph Image Tester</h1>

				<div className="grid lg:grid-cols-2 gap-8">
					{/* Controls */}
					<div className="space-y-6">
						<div className="space-y-2">
							<label className="text-sm font-medium">Title</label>
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Subtitle</label>
							<input
								type="text"
								value={subtitle}
								onChange={(e) => setSubtitle(e.target.value)}
								className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Accent Color</label>
							<input
								type="color"
								value={accent}
								onChange={(e) => setAccent(e.target.value)}
								className="w-full h-12 rounded-lg border border-border cursor-pointer"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Background Color</label>
							<input
								type="color"
								value={background}
								onChange={(e) => setBackground(e.target.value)}
								className="w-full h-12 rounded-lg border border-border cursor-pointer"
							/>
						</div>

						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="grid"
								checked={showGrid}
								onChange={(e) => setShowGrid(e.target.checked)}
								className="w-5 h-5 rounded border-border"
							/>
							<label htmlFor="grid" className="text-sm font-medium">
								Show Grid Pattern
							</label>
						</div>

						<div className="pt-4">
							<button
								onClick={() => {
									setTitle('Skani')
									setSubtitle('Agent Skills Management')
									setAccent('#d98324')
									setBackground('#050505')
									setShowGrid(true)
								}}
								className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
							>
								Reset to Default
							</button>
						</div>
					</div>

					{/* Preview */}
					<div>
						<h2 className="text-lg font-medium mb-4">Preview</h2>
						<div className="rounded-lg overflow-hidden border border-border bg-muted/20">
							<img
								src={imageUrl}
								alt={title}
								className="w-full h-auto"
								style={{ aspectRatio: '1200/630' }}
							/>
						</div>
						<p className="text-sm text-muted-foreground mt-4">
							Dimensions: 1200 × 630 pixels
						</p>
					</div>
				</div>

				{/* Usage Example */}
				<div className="mt-12 border-t border-border pt-8">
					<h2 className="font-serif text-2xl mb-4">Usage in Your Pages</h2>
					<div className="bg-card border border-border rounded-lg p-6 space-y-4">
						<p className="text-muted-foreground">
							Import the generator function and use it in any page to generate OpenGraph images:
						</p>
						<pre className="overflow-x-auto bg-muted p-4 rounded-lg text-sm">
							<code>{`import { generateOpengraphImage } from '@/lib/opengraph-image'

// In your opengraph-image.tsx route
export default async function Image() {
  return generateOpengraphImage({
    title: 'Your Title',
    subtitle: 'Your subtitle',
    icon: <YourIcon />,
  })
}`}</code>
						</pre>
					</div>
				</div>
			</div>
		</div>
	)
}
