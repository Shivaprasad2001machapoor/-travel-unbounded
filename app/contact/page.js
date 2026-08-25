import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BookingForm from "../../components/BookingForm";

export default function Contact() {
  return (
    <>
      <Navbar />

      <main className="bg-slate-50 pt-20">
        <section className="bg-slate-950 px-6 py-24 text-white">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
              Enquire Now
            </p>

            <h1 className="mt-4 text-5xl font-bold md:text-6xl">
              Plan Your Next Journey
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Tell us about your travel plans and our team will help you
              create an unforgettable experience.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200 md:p-12">
            <h2 className="text-3xl font-bold text-slate-900">
              Send us your enquiry
            </h2>

            <p className="mt-3 text-slate-600">
              Fill in your details and we'll get back to you.
            </p>

            <BookingForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}