"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
	text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
			{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
			{copied ? "Copied" : "Copy"}
		</Button>
	);
}
