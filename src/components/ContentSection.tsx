/* ContentSection — Long-form article content for event detail */

interface ContentSectionProps {
  title: string;
  paragraphs: string[];
}

export function ContentSection({ title, paragraphs }: ContentSectionProps) {
  return (
    <div className="max-w-3xl mb-16">
      <h2 className="font-headline text-2xl font-bold text-on-surface mb-8">
        {title}
      </h2>
      <div className="space-y-6">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-on-surface-variant text-lg leading-loose opacity-90"
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
