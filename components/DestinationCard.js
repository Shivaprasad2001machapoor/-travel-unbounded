import Link from "next/link";

export default function DestinationCard({ destination }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-64 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-sm font-medium text-white backdrop-blur">
          {destination.country}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-slate-900">
          {destination.name}
        </h3>

        <p className="mt-3 min-h-20 leading-6 text-slate-600">
          {destination.description}
        </p>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Starting from
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              INR {destination.price.toLocaleString("en-IN")}
            </p>
          </div>

          <Link
            href="/contact"
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-400 hover:text-slate-950"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}
