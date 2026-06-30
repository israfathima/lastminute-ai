import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { api } from "../services/api";

const colors = ["#14B8A6", "#2563EB", "#F59E0B", "#EF4444", "#64748B"];

export default function Analytics() {
  const [data, setData] = useState(null);
  useEffect(() => { api.analytics().then(setData); }, []);
  if (!data) return <div className="card h-64 animate-pulse" />;
  const hasTasks = data.categories.some((item) => item.name !== "No tasks yet");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black">Analytics</h2>
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-bold">Weekly Progress</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer><BarChart data={data.weekly_progress}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><Tooltip /><Bar dataKey="completed" fill="#14B8A6" /></BarChart></ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-bold">Deadline Distribution</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer><PieChart><Pie data={data.deadline_distribution} dataKey="value" nameKey="name" outerRadius={92}>{data.deadline_distribution.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
          </div>
          {!hasTasks && <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">Create a task to replace this onboarding state with live risk distribution.</p>}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        <div className="metric"><p className="text-sm text-slate-500">Completion Rate</p><p className="text-3xl font-black text-teal-600">{data.completion_rate}%</p></div>
        <div className="metric"><p className="text-sm text-slate-500">Focus Hours</p><p className="text-3xl font-black">{data.focus_time}</p></div>
        <div className="metric"><p className="text-sm text-slate-500">Missed Deadlines</p><p className="text-3xl font-black">{data.missed_deadlines}</p></div>
        <div className="metric"><p className="text-sm text-slate-500">Predicted Completion</p><p className="text-3xl font-black">{data.predicted_completion}%</p></div>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="metric"><p className="text-sm text-slate-500">Average Completion Time</p><p className="text-3xl font-black">{data.average_completion_time}</p></div>
        <div className="metric"><p className="text-sm text-slate-500">Upcoming Deadlines</p><p className="text-3xl font-black">{data.upcoming_deadlines}</p></div>
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-bold">Monthly Completion</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer><AreaChart data={data.monthly_progress}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="week" /><Tooltip /><Area dataKey="done" stroke="#2563EB" fill="#BFDBFE" /></AreaChart></ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-bold">Categories</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer><PieChart><Pie data={data.categories} dataKey="value" nameKey="name" outerRadius={92}>{data.categories.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
          </div>
          {!hasTasks && <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">Natural language capture will populate category distribution automatically.</p>}
        </div>
      </section>
    </div>
  );
}
