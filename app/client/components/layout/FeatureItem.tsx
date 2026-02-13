interface FeatureItemProps {
  image?: React.ReactNode;
  title: string;
  description: string;
  reverse?: boolean;
}

export function FeatureItem({
  image,
  title,
  description,
  reverse = false,
}: FeatureItemProps) {
  const defaultImage = (
    <div className="w-full h-96 bg-card rounded-xl overflow-hidden relative border border-border">
      <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent" />
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-30"
      >
        <rect
          x="50"
          y="50"
          width="100"
          height="100"
          stroke="currentColor"
          fill="none"
          className="text-border"
        />
        <rect
          x="80"
          y="80"
          width="100"
          height="100"
          stroke="currentColor"
          fill="none"
          className="text-border"
        />
        <rect
          x="110"
          y="110"
          width="100"
          height="100"
          stroke="currentColor"
          fill="none"
          className="text-border/60"
        />
        <circle
          cx="250"
          cy="250"
          r="80"
          stroke="rgba(217, 131, 36, 0.5)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  );

  return (
    <div className={`grid grid-cols-1 gap-8 ${reverse ? "" : ""}`}>
      {image || defaultImage}
      <div className="space-y-4">
        <h3 className="font-serif text-3xl">{title}</h3>
        <p className="text-muted-foreground max-w-[400px]">{description}</p>
      </div>
    </div>
  );
}
