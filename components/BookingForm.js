"use client";

import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  destination: "",
  travelDates: "",
  travellers: "",
  message: "",
};

export default function BookingForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setStatus("");
  }

  function validate() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!form.destination.trim()) {
      newErrors.destination = "Destination is required.";
    }

    if (!form.travelDates.trim()) {
      newErrors.travelDates = "Travel dates are required.";
    }

    if (!form.travellers) {
      newErrors.travellers = "Number of travellers is required.";
    } else if (Number(form.travellers) < 1) {
      newErrors.travellers = "At least 1 traveller is required.";
    }

    if (!form.message.trim()) {
      newErrors.message = "Please tell us about your trip.";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters.";
    }

    return newErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus("");
      return;
    }

    setErrors({});
    setStatus("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          destination: form.destination,
          travelDates: form.travelDates,
          travellers: Number(form.travellers),
          message: form.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }

        setStatus("error");
        return;
      }

      setStatus("success");
      setForm(initialForm);
    } catch (error) {
      console.error("Submit error:", error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
      {status === "success" && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
          <p className="font-semibold">
            Enquiry submitted successfully!
          </p>

          <p className="mt-1 text-sm">
            Thank you. Our travel team will get back to you soon.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-semibold">
            We couldn't submit your enquiry.
          </p>

          <p className="mt-1 text-sm">
            Please check the form and try again.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block font-semibold text-slate-700"
          >
            Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />

          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block font-semibold text-slate-700"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />

          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block font-semibold text-slate-700"
          >
            Phone
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Your phone number"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />

          {errors.phone && (
            <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="destination"
            className="mb-2 block font-semibold text-slate-700"
          >
            Destination
          </label>

          <input
            id="destination"
            name="destination"
            type="text"
            value={form.destination}
            onChange={handleChange}
            placeholder="Where do you want to go?"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />

          {errors.destination && (
            <p className="mt-2 text-sm text-red-600">
              {errors.destination}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="travelDates"
            className="mb-2 block font-semibold text-slate-700"
          >
            Travel Dates
          </label>

          <input
            id="travelDates"
            name="travelDates"
            type="text"
            value={form.travelDates}
            onChange={handleChange}
            placeholder="e.g. 10 Dec - 18 Dec"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />

          {errors.travelDates && (
            <p className="mt-2 text-sm text-red-600">
              {errors.travelDates}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="travellers"
            className="mb-2 block font-semibold text-slate-700"
          >
            Number of Travellers
          </label>

          <input
            id="travellers"
            name="travellers"
            type="number"
            min="1"
            value={form.travellers}
            onChange={handleChange}
            placeholder="Number of travellers"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />

          {errors.travellers && (
            <p className="mt-2 text-sm text-red-600">
              {errors.travellers}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block font-semibold text-slate-700"
        >
          Message
        </label>

        <textarea
          id="message"
          name="message"
          rows="6"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us about your ideal trip..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />

        {errors.message && (
          <p className="mt-2 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-amber-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit Enquiry"}
      </button>
    </form>
  );
}