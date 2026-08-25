import DestinationCard from "./DestinationCard";

export default function DestinationSection({
  title,
  subtitle,
  destinations,
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
          Travel Collection
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {title}
        </h2>

        <p className="mt-4 text-lg leading-7 text-slate-600">
          {subtitle}
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
          />
        ))}
      </div>
    </section>
  );
}
