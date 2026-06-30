import { useEffect, useMemo, useState } from "react";
import { Wand2 } from "lucide-react";
import { api } from "../services/api";
import RiskBadge from "../components/RiskBadge";

export default function AIPlanner() {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState("");
  const [plan, setPlan] = useState(null);

  useEffect(() => { api.tasks().then((items) => { setTasks(items); setSelected(items[0]?.id || ""); setPlan(items[0]?.ai_plan || null); }); }, []);
  const task = useMemo(() => tasks.find((item) => item.id === selected), [tasks, selected]);

  async function generate() {
    const result = await api.generatePlan(selected);
    setPlan(result);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">AI Planner</h2>
          <p className="text-slate-500">Gemini breaks urgent work into an executable schedule.</p>
        </div>
        <div className="flex gap-2">
          <select className="input w-72" value={selected} onChange={(event) => { setSelected(event.target.value); setPlan(tasks.find((item) => item.id === event.target.value)?.ai_plan); }}>
            {tasks.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
          <button className="btn btn-primary" disabled={!selected} onClick={generate}><Wand2 size={18} /> Generate</button>
        </div>
      </div>
      {!task ? <div className="card p-8 text-center text-slate-500">Add a task to start planning.</div> : (
        <div className="grid gap-6 xl:grid-cols-[.75fr_1.25fr]">
          <section className="card p-6">
            <p className="text-sm text-slate-500">Selected task</p>
            <h3 className="mt-1 text-2xl font-black">{task.title}</h3>
            <div className="mt-5 flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <span className="font-semibold">Risk Meter</span>
              <RiskBadge value={plan?.risk || "Medium"} />
            </div>
            <div className="mt-4 rounded-lg bg-blue-50 p-4 text-blue-900">
              <p className="font-bold">Motivation</p>
              <p>{plan?.motivation || "Generate a plan and I’ll give you the useful nudge."}</p>
            </div>
          </section>
          <section className="card p-6">
            <h3 className="text-xl font-bold">Execution Steps</h3>
            <div className="mt-4 space-y-3">
              {(plan?.execution_plan || []).map((step, index) => (
                <div key={index} className="grid gap-1 rounded-lg border border-slate-200 p-3 sm:grid-cols-[9rem_1fr]">
                  <p className="font-semibold text-teal-700">{step.time}</p>
                  <p className="text-slate-600">{step.action}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4"><p className="font-bold">Estimated Completion</p><p>{plan?.estimated_completion_time || "Pending"}</p></div>
              <div className="rounded-lg bg-slate-50 p-4"><p className="font-bold">Next Action</p><p>{plan?.recommendation || "Choose a task and generate."}</p></div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
