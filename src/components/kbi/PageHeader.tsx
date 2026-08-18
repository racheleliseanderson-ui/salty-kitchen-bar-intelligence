export function PageHeader({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="max-w-3xl">
      <p className="eyebrow">{kicker}</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl">{title}</h1>
      <p className="mt-3 text-base leading-relaxed text-stone-deep">{lede}</p>
    </header>
  );
}
