"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminEnquiriesPage() {
  const router = useRouter();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  async function loadEnquiries() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/enquiry", {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load enquiries.");
      }

      setEnquiries(data.enquiries || []);
    } catch (error) {
      console.error(error);
      setError("Unable to load enquiries. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Logout failed.");
      }

      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Unable to logout. Please try again.");
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    loadEnquiries();
  }, []);

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-amber-500">
              Travel Unbounded
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
              Enquiries Dashboard
            </h1>

            <p className="mt-2 text-slate-600">
              View travel enquiries submitted through the website.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadEnquiries}
              disabled={loading}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-800 transition hover:border-amber-400 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Enquiries
            </p>

            <p className="mt-2 text-3xl font-black text-slate-950">
              {enquiries.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Latest Destination
            </p>

            <p className="mt-2 text-xl font-bold text-slate-950">
              {enquiries[0]?.destination || "—"}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Latest Enquiry
            </p>

            <p className="mt-2 text-xl font-bold text-slate-950">
              {enquiries[0]
                ? formatDate(enquiries[0].createdAt)
                : "—"}
            </p>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <p className="font-bold">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-slate-600">
              Loading enquiries...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && enquiries.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              No enquiries yet
            </h2>

            <p className="mt-2 text-slate-500">
              New enquiries submitted from the Contact page will appear here.
            </p>
          </div>
        )}

        {/* Enquiries Table */}
        {!loading && !error && enquiries.length > 0 && (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-950 text-left text-sm text-white">
                  <tr>
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Destination</th>
                    <th className="px-5 py-4">Travel Dates</th>
                    <th className="px-5 py-4">Travellers</th>
                    <th className="px-5 py-4">Message</th>
                    <th className="px-5 py-4">Submitted</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {enquiries.map((enquiry) => (
                    <tr
                      key={enquiry._id}
                      className="align-top transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-5">
                        <p className="font-bold text-slate-900">
                          {enquiry.name}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm text-slate-700">
                          {enquiry.email}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {enquiry.phone}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                          {enquiry.destination}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-700">
                        {enquiry.travelDates}
                      </td>

                      <td className="px-5 py-5 text-center font-semibold text-slate-700">
                        {enquiry.travellers}
                      </td>

                      <td className="min-w-64 max-w-md px-5 py-5 text-sm leading-6 text-slate-600">
                        {enquiry.message}
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-500">
                        {formatDate(enquiry.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}