import { ImageResponse } from 'next/og'

export const alt = 'Skani - Agent Skills Management'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const skaniIcon = (
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
	return new ImageResponse(
		(
			<div
				style={{
					fontSize: 64,
					background: '#050505',
					color: '#ffffff',
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				{/* Background layers */}
				<div style={{ position: 'absolute', inset: 0, zIndex: 0, display: 'flex' }}>
					{/* Amber glow gradient */}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							background: 'radial-gradient(circle at 30% 40%, #d9832415 0%, transparent 50%)',
							display: 'block',
						}}
					/>

					{/* Grid pattern overlay */}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							backgroundImage: `
								linear-gradient(to right, #d9832408 1px, transparent 1px),
								linear-gradient(to bottom, #d9832408 1px, transparent 1px)
							`,
							backgroundSize: '40px 40px',
							display: 'block',
						}}
					/>

					{/* Decorative corners */}
					<div
						style={{
							position: 'absolute',
							top: '20px',
							left: '20px',
							width: '80px',
							height: '80px',
							borderTop: '1px solid #d9832440',
							borderLeft: '1px solid #d9832440',
							display: 'block',
						}}
					/>
					<div
						style={{
							position: 'absolute',
							bottom: '20px',
							right: '20px',
							width: '80px',
							height: '80px',
							borderBottom: '1px solid #d9832440',
							borderRight: '1px solid #d9832440',
							display: 'block',
						}}
					/>

					{/* Bottom accent line */}
					<div
						style={{
							position: 'absolute',
							bottom: '60px',
							left: '50%',
							transform: 'translateX(-50%)',
							width: '200px',
							height: '2px',
							background: 'linear-gradient(90deg, transparent, #d98324, transparent)',
							opacity: 0.5,
							display: 'block',
						}}
					/>
				</div>

				{/* Main content */}
				<div
					style={{
						position: 'relative',
						zIndex: 1,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '24px',
					}}
				>
					{skaniIcon}

					<div
						style={{
							fontWeight: 700,
							fontSize: '64px',
							letterSpacing: '-0.02em',
							textShadow: '0 0 40px rgba(217,131,36,0.2)',
						}}
					>
						Skani
					</div>

					<div
						style={{
							fontSize: '20px',
							color: '#888888',
							marginTop: '16px',
							letterSpacing: '0.01em',
							textTransform: 'uppercase',
							fontWeight: 400,
						}}
					>
						Agent Skills Management
					</div>
				</div>
			</div>
		),
		size
	)
}
