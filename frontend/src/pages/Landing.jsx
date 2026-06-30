import { Link } from "react-router-dom";
import { ArrowRight, Brain, CalendarCheck, ShieldAlert, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const features = [
    ["AI Planning", Brain],
    ["Smart Prioritization", Sparkles],
    ["Risk Detection", ShieldAlert],
    ["Daily Schedule", CalendarCheck],
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3 font-bold"><span className="grid size-9 place-items-center rounded-lg bg-teal-500">LM</span> LastMinute AI</div>
        <Link className="btn btn-primary" to="/login">Get Started <ArrowRight size={18} /></Link>
      </header>
      <main className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="max-w-3xl text-5xl font-black leading-tight lg:text-7xl">Never Miss Another Deadline.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">AI proactively plans your day, prioritizes your work, and keeps you moving before deadlines become emergencies.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn btn-primary" to="/login">Get Started <ArrowRight size={18} /></Link>
            <Link className="btn border border-white/15 bg-white/10 text-white hover:bg-white/15" to="/app/dashboard">View Demo</Link>
          </div>
        </motion.section>
        <motion.section className="rounded-lg border border-white/10 bg-white/10 p-5 shadow-2xl" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="rounded-lg bg-white p-4 text-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-bold">Today’s rescue plan</p>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">High risk</span>
            </div>
            {["Submit proposal draft", "Prepare interview notes", "Pay vendor invoice"].map((item, index) => (
              <div key={item} className="mb-3 rounded-lg border border-slate-200 p-3">
                <p className="font-semibold">{item}</p>
                <p className="text-sm text-slate-500">{index + 1}. Focus block scheduled with next action ready.</p>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(([label, Icon]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-white/10 p-5">
            <Icon className="mb-4 text-teal-300" />
            <p className="font-bold">{label}</p>
          </div>
        ))}
      </section>
      <footer className="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-400">Built for Google AI Hackathon with Gemini, Firebase, and Cloud Run.</footer>
    </div>
  );
}
