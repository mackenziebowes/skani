"use client"

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function LandingNav() {
	const [open, setOpen] = useState(false);
	const isMobile = useIsMobile();

	return (
		<nav className="py-6 lg:py-10 flex justify-between items-center border-b border-border px-6 lg:px-10">
			<Link href="/" className="font-serif text-xl lg:text-2xl font-normal tracking-[-0.02em]">
				Skani.
			</Link>
			<div className="flex gap-6 lg:gap-10">
				<div className="hidden lg:flex gap-10">
					<Link
						href="/docs"
						className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
					>
						Documentation
					</Link>
					<Link
						href="/skills"
						className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
					>
						Registry
					</Link>
				</div>
				<Drawer open={open && isMobile} onOpenChange={setOpen}>
					<DrawerTrigger asChild>
						<Button variant="ghost" size="icon" className="lg:hidden">
							<Menu className="h-6 w-6" />
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<nav className="p-6 space-y-4">
							<Link
								href="/docs"
								onClick={() => setOpen(false)}
								className="block text-lg text-muted-foreground no-underline transition-colors hover:text-foreground py-2"
							>
								Documentation
							</Link>
							<Link
								href="/skills"
								onClick={() => setOpen(false)}
								className="block text-lg text-muted-foreground no-underline transition-colors hover:text-foreground py-2"
							>
								Registry
							</Link>
						</nav>
					</DrawerContent>
				</Drawer>
			</div>
		</nav>
	);
}
