"use client";

import { useState } from "react";

export default function PlannerPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your Travel Unbounded AI Travel Agent. Tell me where you want to go, how many days you have, your starting location, number of travelers, and your budget."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input.trim()
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/travel-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: updatedMessages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI request failed");
      }

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.message
        }
      ]);
    } catch (error) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't generate your travel plan right now. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 pt-24 text-white">
      <div className="mx-auto max-w-5xl px-6 pb-12">

        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            AI Travel Agent
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Plan Your Journey with AI
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Tell me your destination, duration and budget. I'll create a
            personalized travel itinerary for you.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">

          <div className="h-[600px] overflow-y-auto bg-slate-50 p-6">

            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-5 flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-5 py-4 text-sm leading-7 ${
                    message.role === "user"
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-800 shadow-md ring-1 ring-slate-200"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-5 py-4 text-sm text-slate-500 shadow-md ring-1 ring-slate-200">
                  AI is planning your trip...
                </div>
              </div>
            )}

          </div>

          <div className="border-t border-slate-200 bg-white p-4">
            <div className="flex gap-3">

              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Example: I want to visit Kerala for 5 days from Hyderabad for 2 people with a budget of ?25,000."
                rows={2}
                className="flex-1 resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />

              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="self-end rounded-2xl bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Planning..." : "Send"}
              </button>

            </div>

            <p className="mt-2 text-xs text-slate-400">
              Press Enter to send � Shift + Enter for a new line
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}
