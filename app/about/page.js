import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const team = [
  {
    name: "Kunal Shah",
    role: "Co-Founder & Director",
  },
  {
    name: "Arjun Menon",
    role: "Co-Founder & Director",
  },
  {
    name: "David Kimani",
    role: "Director, Africa Operations",
  },
];

export default function About() {
  return (
    <>
      <Navbar />

      <main className="bg-slate-50 pt-20">
        <section className="bg-slate-950 px-6 py-24 text-white">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
              About Us
            </p>

            <h1 className="mt-4 text-5xl font-bold md:text-6xl">
              Travel built around experiences
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Travel Unbounded is an experiential travel company focused on
              creating meaningful journeys across India and the world.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
                Who We Are
              </p>

              <h2 className="mt-3 text-4xl font-bold text-slate-900">
                India's Most Trusted Experiential Travel Experts
              </h2>

              <p className="mt-6 leading-8 text-slate-600">
                Travel Unbounded creates carefully designed travel
                experiences that connect travellers with destinations,
                cultures and people.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                From discovering India's diverse landscapes to exploring
                international destinations, our approach focuses on creating
                journeys that travellers remember long after they return home.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
              <h3 className="text-2xl font-bold text-slate-900">
                Our Offices
              </h3>

              <div className="mt-6 space-y-5">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <h4 className="font-bold text-slate-900">Bengaluru</h4>
                  <p className="mt-1 text-slate-600">
                    India headquarters
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <h4 className="font-bold text-slate-900">Kochi</h4>
                  <p className="mt-1 text-slate-600">
                    Kerala, India
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <h4 className="font-bold text-slate-900">Nairobi</h4>
                  <p className="mt-1 text-slate-600">
                    Kenya
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
                Our Leadership
              </p>

              <h2 className="mt-3 text-4xl font-bold text-slate-900">
                Meet the Team
              </h2>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-2xl font-bold text-amber-400">
                    {member.name.charAt(0)}
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-900">
                    {member.name}
                  </h3>

                  <p className="mt-2 text-slate-600">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-amber-400 px-6 py-16 text-center">
          <h2 className="text-4xl font-bold text-slate-950">
            Ready to explore?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-800">
            Tell us what kind of journey you're looking for and we'll help
            you plan it.
          </p>

          <Link
            href="/contact"
            className="mt-7 inline-block rounded-full bg-slate-950 px-7 py-3.5 font-bold text-white"
          >
            Plan Your Trip
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}