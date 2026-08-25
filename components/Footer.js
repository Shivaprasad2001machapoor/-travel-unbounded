export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-2xl font-bold">
              Travel <span className="text-amber-400">Unbounded</span>
            </h2>

            <p className="mt-4 max-w-md leading-7 text-slate-400">
              India's Most Trusted Experiential Travel Experts. We create
              journeys built around people, culture, comfort and unforgettable
              experiences.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>

            <div className="mt-4 flex flex-col gap-3 text-slate-400">
              <a href="/" className="transition hover:text-white">
                Home
              </a>

              <a href="/about" className="transition hover:text-white">
                About
              </a>

              <a href="/contact" className="transition hover:text-white">
                Contact
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Our Offices</h3>

            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
              <p>Bengaluru, India</p>
              <p>Kochi, Kerala, India</p>
              <p>Nairobi, Kenya</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-500">
          Copyright {new Date().getFullYear()} Travel Unbounded. All rights reserved.
        </div>
      </div>
    </footer>
  );
}