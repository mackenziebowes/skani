import { FeatureItem } from "./FeatureItem";

interface Feature {
  image?: React.ReactNode;
  title: string;
  description: string;
}

interface ManifestoSectionProps {
  title: string;
  subtitle: string;
  features: Feature[];
}

export function ManifestoSection({
  title,
  subtitle,
  features,
}: ManifestoSectionProps) {
  return (
    <section className="py-20 lg:py-40">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-15 lg:gap-30">
        <div className="sticky max-lg:top-0 lg:top-10 max-lg:-m-t-2 max-lg:py-10 z-10 bg-background h-fit">
          <h2 className="font-serif text-[42px] lg:text-[56px] leading-[1.1] mb-6">
            {title}
          </h2>
          <p className="text-muted-foreground mt-5">{subtitle}</p>
        </div>
        <div className="flex flex-col gap-20 lg:gap-30">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              title={feature.title}
              description={feature.description}
              image={feature.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
