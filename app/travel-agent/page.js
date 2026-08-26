"use client";

import { useState } from "react";

const SECTIONS = [
  { key: "accommodation", label: "Accommodation", icon: "🏨", names: ["ACCOMMODATION", "ACCOMMODATION RECOMMENDATIONS"] },
  { key: "transportation", label: "Transportation", icon: "🚆", names: ["TRANSPORTATION", "TRANSPORTATION SUMMARY"] },
  { key: "food", label: "Food to try", icon: "🍽️", names: ["FOOD TO TRY", "FOOD"] },
  { key: "budget", label: "Budget breakdown", icon: "💰", names: ["ESTIMATED BUDGET", "ESTIMATED BUDGET BREAKDOWN", "BUDGET BREAKDOWN"] },
  { key: "tips", label: "Travel tips", icon: "💡", names: ["TRAVEL TIPS", "TIPS"] },
];

const clean = (line) => line.replace(/^\s*[-*•]\s*/, "").replace(/\*\*/g, "").trim();
const heading = (line) => line.replace(/^\s*#{1,6}\s*/, "").replace(/[:*]/g, "").trim().toUpperCase();
const sectionMatch = (line, names) => names.some((name) => heading(line) === name || heading(line).startsWith(`${name} `));
const mapsUrl = (text) => (text.match(/\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/i)?.[1] || text.match(/https?:\/\/[^\s)]+/i)?.[0])?.replace(/[.,]+$/, "");
function labelValue(line) { const text = clean(line).replace(/\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/gi, "$1"); const match = text.match(/^([^:]{2,40}):\s*(.+)$/); return match && { label: match[1].trim(), value: match[2].trim() }; }

function parsePlan(text) {
  const days = []; const sections = {}; const overview = []; let active = "overview"; let day = null;
  for (const line of text.replace(/\r/g, "").split("\n")) {
    const foundDay = heading(line).match(/^DAY\s*(\d+)\b\s*[-–—:]?\s*(.*)$/i);
    if (foundDay) { day = { number: foundDay[1], title: foundDay[2].trim(), lines: [] }; days.push(day); active = "day"; continue; }
    const foundSection = SECTIONS.find((section) => sectionMatch(line, section.names));
    if (foundSection) { active = foundSection.key; sections[active] ||= []; day = null; continue; }
    if (sectionMatch(line, ["TRIP OVERVIEW", "ITINERARY", "YOUR ITINERARY"])) { active = "overview"; day = null; continue; }
    if (active === "day" && day) day.lines.push(line); else if (active === "overview") overview.push(line); else sections[active].push(line);
  }
  return { days, sections, overview };
}

function DetailList({ lines, dark = false }) {
  const text = dark ? "text-slate-200" : "text-slate-600"; const label = dark ? "text-white" : "text-slate-900";
  const rows = lines.map(clean).filter(Boolean);
  return <div className="space-y-2 text-sm">{rows.map((line, index) => { const item = labelValue(line); const url = mapsUrl(line); return <div key={`${line}-${index}`} className={item ? "grid gap-1 sm:grid-cols-[10rem_1fr]" : "flex gap-2"}>{item ? <span className={`font-semibold ${label}`}>{item.label}</span> : <span className="text-amber-500">•</span>}<span className={text}>{item ? item.value : line}</span>{url && <a href={url} target="_blank" rel="noopener noreferrer" className="sm:col-start-2 inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800">🗺️ Open in Google Maps <span>↗</span></a>}</div>; })}</div>;
}

function DayCard({ day }) {
  const periods = []; const details = []; let current = null;
  day.lines.map(clean).filter(Boolean).forEach((line) => { const period = line.match(/^(morning|afternoon|evening|night)\s*:?\s*(.*)$/i); if (period) { current = { title: period[1], lines: period[2] ? [period[2]] : [] }; periods.push(current); return; } const item = labelValue(line); if (item && /^(places?|transport(?:ation)?|estimated time|travel time|estimated cost|cost|map|directions?|route)$/i.test(item.label)) details.push(line); else if (current) current.lines.push(line); else details.push(line); });
  const url = mapsUrl(day.lines.join("\n"));
  return <section className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200"><div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-300 to-amber-400 px-6 py-5 text-slate-950"><div><p className="text-xs font-extrabold uppercase tracking-[.2em] opacity-70">Day {day.number}</p><h2 className="mt-1 text-2xl font-bold">{day.title || "Your day-by-day plan"}</h2></div><span className="rounded-full bg-white/60 px-3 py-1 text-sm font-bold">📍 Itinerary</span></div><div className="space-y-5 p-5 md:p-6">{periods.length > 0 && <div className="grid gap-3 md:grid-cols-3">{periods.map((period) => <div key={period.title} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100"><h3 className="mb-2 capitalize font-bold text-slate-900">{period.title === "morning" ? "🌅" : period.title === "afternoon" ? "☀️" : "🌙"} {period.title}</h3><DetailList lines={period.lines} /></div>)}</div>}{details.length > 0 && <div className="rounded-2xl border border-slate-100 p-4"><h3 className="mb-3 font-bold text-slate-900">Plan details</h3><DetailList lines={details} /></div>}{url && <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">🗺️ Open route in Google Maps <span>↗</span></a>}</div></section>;
}

function TripResult({ text }) {
  const { days, sections, overview } = parsePlan(text); const structured = days.length || Object.values(sections).some((lines) => lines.length);
  if (!structured) return <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200"><DetailList lines={text.split("\n")} /></section>;
  return <div className="space-y-6">{overview.some((line) => clean(line)) && <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg"><div className="mb-4 flex items-center gap-3"><span className="text-3xl">🌍</span><div><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-300">Your journey</p><h2 className="text-2xl font-bold">Trip overview</h2></div></div><div className="rounded-2xl bg-white/10 p-4"><DetailList dark lines={overview} /></div></section>}{days.map((day) => <DayCard key={day.number} day={day} />)}{SECTIONS.map((section) => sections[section.key]?.some((line) => clean(line)) && <section key={section.key} className={`rounded-3xl p-6 shadow-lg ring-1 ${section.key === "budget" ? "bg-slate-950 text-white ring-slate-800" : section.key === "tips" ? "bg-amber-50 ring-amber-200" : "bg-white ring-slate-200"}`}><h2 className={`mb-4 text-2xl font-bold ${section.key === "budget" ? "text-amber-300" : "text-slate-900"}`}>{section.icon} {section.label}</h2><DetailList dark={section.key === "budget"} lines={sections[section.key]} /></section>)}</div>;
}

export function TravelAgent() {
  const [messages, setMessages] = useState([]); const [input, setInput] = useState(""); const [loading, setLoading] = useState(false);
  async function sendMessage() { if (!input.trim() || loading) return; const user = { role: "user", content: input.trim() }; const conversation = [...messages, user]; setMessages(conversation); setInput(""); setLoading(true); try { const response = await fetch("/api/ai/travel-agent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: conversation }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || data.message || "AI request failed"); setMessages([...conversation, { role: "assistant", content: data.message }]); } catch (error) { console.error(error); setMessages([...conversation, { role: "assistant", content: error.message || "Sorry, I couldn't create your travel plan right now. Please try again." }]); } finally { setLoading(false); } }
  return <main className="min-h-screen bg-slate-950 px-4 pb-10 pt-28 text-white"><div className="mx-auto max-w-5xl"><header className="mb-8 text-center"><p className="text-sm font-semibold uppercase tracking-[.3em] text-amber-400">AI Travel Agent</p><h1 className="mt-3 text-4xl font-bold md:text-5xl">Your Personal Trip Planner</h1><p className="mx-auto mt-4 max-w-2xl text-slate-300">Tell me your destination, duration, starting location, number of travelers and budget. I&apos;ll create your complete itinerary.</p></header><div className="rounded-3xl bg-white shadow-2xl"><div className="max-h-[70vh] overflow-y-auto bg-slate-50 p-5 md:p-8">{messages.length === 0 && <div className="flex min-h-[45vh] items-center justify-center"><div className="max-w-xl text-center"><div className="text-6xl">🧳</div><h2 className="mt-5 text-2xl font-bold text-slate-900">Let&apos;s plan your next adventure</h2><p className="mt-3 text-slate-600">Give me your travel details and I&apos;ll handle the planning.</p><button onClick={() => setInput("I want to visit Kerala for 5 days from Hyderabad for 2 people with a budget of 25000 rupees.")} className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-left text-sm text-slate-700 shadow-sm hover:border-amber-400"><strong>Example:</strong><br />I want to visit Kerala for 5 days from Hyderabad for 2 people with a budget of ₹25,000.</button></div></div>}<div className="space-y-6">{messages.map((message, index) => <div key={index}>{message.role === "user" ? <div className="flex justify-end"><div className="max-w-[85%] rounded-2xl rounded-br-md bg-amber-400 px-5 py-4 text-sm leading-7 text-slate-950"><div className="mb-1 text-xs font-bold uppercase opacity-60">You</div>{message.content}</div></div> : <div className="mt-4"><div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">✦ Travel AI</div><TripResult text={message.content} /></div>}</div>)}{loading && <div className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow ring-1 ring-slate-200">✨ AI is creating your complete travel plan...</div>}</div></div><div className="border-t border-slate-200 bg-white p-4"><div className="flex gap-3"><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} rows={2} placeholder="Example: Plan a 5-day trip to Goa from Hyderabad..." className="min-w-0 flex-1 resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" /><button onClick={sendMessage} disabled={loading || !input.trim()} className="rounded-2xl bg-slate-950 px-6 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">{loading ? "..." : "Send"}</button></div><p className="mt-2 text-xs text-slate-400">Enter to send · Shift + Enter for a new line</p></div></div></div></main>;
}

export default TravelAgent;
