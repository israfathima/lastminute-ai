import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, PieChart, Pie, Cell } from "recharts";
import { Brain, CalendarPlus, Clock, Flame, ListChecks, Timer, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import RiskBadge from "../components/RiskBadge";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [command, setCommand] = useState(null);
  const [dailyPlan, setDailyPlan] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([api.dashboard(), api.analytics(), api.commandCenter(user?.displayName || "there"), api.dailyPlan()]).then(([dashboard, chartData, commandData, planData]) => {
      setData(dashboard);
      setAnalytics(chartData);
      setCommand(commandData);
      setDailyPlan(planData);
    });
  }, [user]);

  if (!data) return <div className="card h-64 animate-pulse" />;

  const maxRisk = ["Critical", "High", "Medium", "Low"].find((risk) => data.deadline_risk?.[risk]) || "Low";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">Command Center</h2>
          <p className="text-slate-500">AI-ranked work, risk signals, and the next move.</p>
        </div>
        <div className="flex gap-2">
          <Link className="btn btn-secondary" to="/app/planner"><Brain size={18} /> Generate AI Plan</Link>
          <Link className="btn btn-primary" to="/app/add-task"><CalendarPlus size={18} /> Add Task</Link>
        </div>
      </div>
      {command && (
        <motion.section className="glass overflow-hidden p-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-teal-700">AI Command Center</p>
              <h3 className="mt-2 text-3xl font-black">{command.greeting}</h3>
              <p className="mt-3 max-w-2xl text-slate-600">{command.summary}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="metric"><p className="text-xs text-slate-500">Today's Focus</p><p className="mt-1 font-bold">{command.todays_focus}</p></div>
                <div className="metric"><p className="text-xs text-slate-500">Estimated Workload</p><p className="mt-1 font-bold">{command.estimated_workload}</p></div>
                <div className="metric"><p className="text-xs text-slate-500">Remaining Hours</p><p className="mt-1 font-bold">{command.remaining_hours || command.productive_hours} hrs</p></div>
                <div className="metric"><p className="text-xs text-slate-500">Success Probability</p><p className="mt-1 text-2xl font-black text-teal-600">{command.success_probability}%</p></div>
              </div>
              <p className="mt-5 rounded-lg bg-white/70 p-3 text-sm text-slate-600">{command.ai_summary}</p>
            </div>
            <div className="rounded-lg bg-slate-950 p-5 text-white shadow-xl">
              <div className="flex items-center justify-between"><span className="font-bold">Deadline Health</span><RiskBadge value={command.deadline_health === "Healthy" ? "Low" : "High"} /></div>
              <p className="mt-5 text-sm text-slate-300">Next Best Action</p>
              <p className="mt-1 text-xl font-bold">{command.next_best_action}</p>
              <p className="mt-5 text-sm leading-6 text-slate-300">{command.energy_recommendation}</p>
            </div>
          </div>
        </motion.section>
      )}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Today's Tasks" value={data.today_tasks} />
        <StatCard label="Upcoming Deadlines" value={data.upcoming_deadlines} />
        <StatCard label="Completed Tasks" value={data.completed_tasks} />
        <StatCard label="Productivity Score" value={`${data.productivity_score}%`} tone="text-teal-600" />
        <div className="card p-5"><p className="text-sm text-slate-500">Deadline Risk</p><div className="mt-4"><RiskBadge value={maxRisk} /></div></div>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <div className="card p-5">
          <h3 className="font-bold">Weekly Productivity</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.weekly_progress || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" />
                <Tooltip />
                <Area dataKey="completed" stroke="#14B8A6" fill="#99F6E4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-bold">Smart Daily Planner</h3>
          <div className="mt-4 space-y-3">
            {(dailyPlan?.schedule || []).map((slot) => (
              <div key={`${slot.start}-${slot.title}`} className="grid grid-cols-[5rem_1fr_auto] items-center gap-3 rounded-lg bg-slate-50 p-3">
                <p className="text-sm font-bold text-teal-700">{slot.start}</p>
                <p className="font-semibold">{slot.title}</p>
                <RiskBadge value={slot.risk || "Low"} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="card p-5">
          <h3 className="font-bold">AI Suggestions</h3>
          <div className="mt-4 space-y-3">
            {data.ai_suggestions.map((suggestion) => (
              <div key={suggestion} className="flex gap-3 rounded-lg bg-slate-50 p-3 text-sm"><Timer className="mt-0.5 text-teal-600" size={18} /> {suggestion}</div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-bold">Risk Meter</h3>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={analytics?.deadline_distribution || []} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78}>{(analytics?.deadline_distribution || []).map((_, i) => <Cell key={i} fill={["#14B8A6", "#2563EB", "#F59E0B", "#EF4444"][i % 4]} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </div>
          {analytics?.deadline_distribution?.[0]?.name === "No risk yet" && <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">Add a deadline to activate live risk scoring.</p>}
        </div>
        <div className="card p-5">
          <h3 className="font-bold">Focus Timer</h3>
          <div className="mt-5 grid place-items-center rounded-lg bg-teal-50 p-8 text-center">
            <Clock className="text-teal-600" />
            <p className="mt-3 text-4xl font-black">25:00</p>
            <Link className="btn btn-primary mt-4" to="/app/focus"><Zap size={18} /> Start Focus</Link>
          </div>
        </div>
      </section>
      <section className="grid gap-6 xl:grid-cols-4">
        <div className="card p-5"><h3 className="font-bold">High Risk Tasks</h3><div className="mt-3 space-y-2">{(command?.high_risk_tasks || ["No high-risk tasks"]).map((task) => <p key={task} className="rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-800"><Flame size={16} className="mr-2 inline" />{task}</p>)}</div></div>
        <div className="card p-5"><h3 className="font-bold">Medium Risk Tasks</h3><div className="mt-3 space-y-2">{(command?.medium_risk_tasks || ["No medium-risk tasks"]).map((task) => <p key={task} className="rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-800"><Timer size={16} className="mr-2 inline" />{task}</p>)}</div></div>
        <div className="card p-5"><h3 className="font-bold">Safe Tasks</h3><div className="mt-3 space-y-2">{(command?.safe_tasks || ["No safe tasks yet"]).map((task) => <p key={task} className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-800"><ListChecks size={16} className="mr-2 inline" />{task}</p>)}</div></div>
        <div className="card p-5"><h3 className="font-bold">Activity Feed</h3><div className="mt-3 space-y-2">{(data.recent_activity || []).map((task) => <p key={task.id} className="rounded-lg bg-slate-50 p-3 text-sm">{task.title}</p>)}</div></div>
      </section>
    </div>
  );
}
