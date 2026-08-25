import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DestinationSection from "../components/DestinationSection";
import destinations from "../data/destinations";

export default function Home() {
  const indiaDestinations = destinations.filter(
    (destination) => destination.category === "india"
  );

  const internationalDestinations = destinations.filter(
    (destination) => destination.category === "international"
  );

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 pt-20">
        <section className="relative overflow-hidden bg-slate-950">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=85"
              alt="Beautiful travel landscape"
              className="h-full w-full object-cover opacity-50"
            />
          </div>

          <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-6 py-24">
            <div className="max-w-3xl text-white">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
                Travel Unbounded
              </p>

              <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
                India's Most Trusted Experiential Travel Experts
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
                Discover journeys built around people, culture, comfort and
                unforgettable experiences.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="rounded-full bg-amber-400 px-7 py-3.5 font-bold text-slate-950 transition hover:bg-amber-300"
                >
                  Plan Your Trip
                </Link>

                <a
                  href="#destinations"
                  className="rounded-full border border-white/40 px-7 py-3.5 font-semibold text-white transition hover:bg-white hover:text-slate-950"
                >
                  Explore Destinations
                </a>
              </div>
            </div>
          </div>
        </section>

        <div id="destinations">
          <DestinationSection
            title="Explore India"
            subtitle="From peaceful backwaters to dramatic Himalayan landscapes, discover unforgettable experiences across India."
            destinations={indiaDestinations}
          />

          <div className="bg-white">
            <DestinationSection
              title="Explore the World"
              subtitle="Travel beyond borders and experience remarkable wildlife, culture and natural wonders around the world."
              destinations={internationalDestinations}
            />
          </div>
        </div>

        <section className="bg-amber-400 px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-800">
              Your next adventure starts here
            </p>

            <h2 className="mt-4 text-4xl font-bold text-slate-950 md:text-5xl">
              Let's build your perfect journey.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-800">
              Tell us where you want to go, and our travel experts will help
              create an experience around you.
            </p>

            <Link
              href="/contact"
              className="mt-8 inline-block rounded-full bg-slate-950 px-7 py-3.5 font-bold text-white transition hover:bg-slate-800"
            >
              Start Planning
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
