interface SectionTitleProps {
  title: string;
  abstract?: string;
}

export default function SectionTitle({ title, abstract }: SectionTitleProps) {
  return (
    <div className="mx-auto text-center mt-8 mb-16">
      <h2 className="text-balance text-5xl font-medium tracking-tight">
        {title}
      </h2>
      {abstract && <p className="mt-4">{abstract}</p>}
    </div>
  );
}
