interface BreadcrumbItem {
  label: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-8">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`}>
          <span className={item.active ? "text-primary" : ""}>
            {item.label}
          </span>
          {index < items.length - 1 && <span>/</span>}
        </div>
      ))}
    </div>
  );
}
