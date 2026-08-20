export function PageHeader({
  kicker,
  title,
  lede,
  image,
  imageAlt,
}: {
  kicker: string;
  title: string;
  lede: string;
  image?: string;
  imageAlt?: string;
}) {
  if (!image) {
    return (
      <header className="max-w-3xl">
        <p className="label-mono text-brass">{kicker}</p>
        <h1 className="mt-2 font-display text-3xl text-bone sm:text-4xl">{title}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{lede}</p>
      </header>
    );
  }

  return (
    <header className="relative isolate min-h-[14rem] overflow-hidden rounded-lg sm:min-h-[16rem]">
      <img
        src={image}
        alt={imageAlt ?? ""}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="ink-veil absolute inset-0" />
      <div className="relative max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="label-mono text-brass">{kicker}</p>
        <h1 className="mt-2 font-display text-3xl text-bone sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/85">{lede}</p>
      </div>
    </header>
  );
}
