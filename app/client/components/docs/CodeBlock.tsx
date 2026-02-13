"use client";
import { Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  className?: string;
  copyable?: boolean;
  showDots?: boolean;
  successMessage?: string;
}

export function CodeBlock({
  code,
  className = "",
  copyable = true,
  showDots = true,
  successMessage,
}: CodeBlockProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    if (successMessage) {
      console.log(successMessage);
    }
  };

  return (
    <div
      className={`relative bg-[#0a0a0a] border border-gray-800 rounded-lg p-6 font-mono text-sm ${className}`}
    >
      {showDots && (
        <div className="flex gap-3 mb-4 opacity-30">
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
        </div>
      )}
      <div className="flex gap-3 text-gray-300">
        <span className="text-amber-accent select-none">➜</span>
        <span className="text-gray-500 select-none">~</span>
        <span>{code}</span>
      </div>
      {successMessage && (
        <div className="mt-2 text-gray-500 select-none">
          <span className="text-green-500">✔</span> {successMessage}
        </div>
      )}
      {copyable && (
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors"
          title="Copy to clipboard"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
