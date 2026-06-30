import { useEffect, useState } from "react";
import { Flame, Lightbulb, TrendingUp } from "lucide-react";
import { api } from "../services/api";

export default function Insights() {
  const [data, setData] = useState(null);
  useEffect(() => { api.insights().then(setData); }, []);
  if (!data) return <div className="card h-64 animate-pulse" />;

  return (
    <div className="space-y-6">
      <section className="glass p-6">
        <p className="text-sm font-bold uppercase tracking-wider text-teal-700">AI Insights</p>
        <h2 className="mt-2 text-3xl font-black">Weekly Review</h2>
        <p className="mt-3 max-w-3xl text-slate-600">{data.weekly_review}</p>
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5"><TrendingUp className="text-teal-600" /><p className="mt-4 text-sm text-slate-500">Productivity Trend</p><p className="text-2xl font-black">{data.productivity_trend}</p></div>
        <div className="card p-5"><Flame className="text-rose-600" /><p className="mt-4 text-sm text-slate-500">Burnout Detection</p><p className="text-2xl font-black">{data.burnout_detection}</p></div>
        <div className="card p-5"><Lightbulb className="text-blue-600" /><p className="mt-4 text-sm text-slate-500">Most Productive Hours</p><p className="text-2xl font-black">{data.most_productive_hours.join(", ")}</p></div>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        {["strengths", "weaknesses", "suggestions"].map((key) => (
          <div key={key} className="card p-5">
            <h3 className="font-bold capitalize">{key}</h3>
            <div className="mt-4 space-y-2">{data[key].map((item) => <p key={item} className="rounded-lg bg-slate-50 p-3 text-sm">{item}</p>)}</div>
          </div>
        ))}
        <div className="card p-5">
          <h3 className="font-bold">Time Waste Analysis</h3>
          <p className="mt-4 rounded-lg bg-amber-50 p-4 text-amber-900">{data.time_waste_analysis}</p>
        </div>
      </section>
    </div>
  );
}
