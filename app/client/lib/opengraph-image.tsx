import { ImageResponse } from 'next/og'

export interface OpengraphProps {
	title: string
	subtitle?: string
	icon?: React.ReactNode
	size?: { width: number; height: number }
	background?: string
	accent?: string
	showGrid?: boolean
}

export async function generateOpengraphImage({
	title,
	subtitle,
	icon,
	size = { width: 1200, height: 630 },
	background = '#050505',
	accent = '#d98324',
	showGrid = true,
}: OpengraphProps) {
	return new ImageResponse(
		(
			<div
				style={{
					fontSize: 64,
					background,
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
				{/* Amber glow gradient */}
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: `radial-gradient(circle at 30% 40%, ${accent}15 0%, transparent 50%)`,
					}}
				/>

				{showGrid && (
					/* Grid pattern overlay */
					<div
						style={{
							position: 'absolute',
							inset: 0,
							backgroundImage: `
								linear-gradient(to right, ${accent}08 1px, transparent 1px),
								linear-gradient(to bottom, ${accent}08 1px, transparent 1px)
							`,
							backgroundSize: '40px 40px',
						}}
					/>
				)}

				{/* Decorative corners */}
				<div
					style={{
						position: 'absolute',
						top: '20px',
						left: '20px',
						width: '80px',
						height: '80px',
						borderTop: `1px solid ${accent}40`,
						borderLeft: `1px solid ${accent}40`,
					}}
				/>
				<div
					style={{
						position: 'absolute',
						bottom: '20px',
						right: '20px',
						width: '80px',
						height: '80px',
						borderBottom: `1px solid ${accent}40`,
						borderRight: `1px solid ${accent}40`,
					}}
				/>

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
					{icon && <div style={{ filter: 'drop-shadow(0 0 30px rgba(217,131,36,0.3))' }}>{icon}</div>}

					<div
						style={{
							fontWeight: 700,
							fontSize: '64px',
							letterSpacing: '-0.02em',
							textShadow: '0 0 40px rgba(217,131,36,0.2)',
						}}
					>
						{title}
					</div>

					{subtitle && (
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
							{subtitle}
						</div>
					)}
				</div>

				{/* Bottom accent line */}
				<div
					style={{
						position: 'absolute',
						bottom: '60px',
						left: '50%',
						transform: 'translateX(-50%)',
						width: '200px',
						height: '2px',
						background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
						opacity: 0.5,
					}}
				/>
			</div>
		),
		size
	)
}
