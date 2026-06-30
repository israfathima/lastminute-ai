import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";
import RiskBadge from "../components/RiskBadge";

export default function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => { api.task(id).then(setTask); }, [id]);
  if (!task) return <div className="card h-64 animate-pulse" />;
  const plan = task.ai_plan || {};

  return (
    <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
      <section className="card p-6">
        <p className="text-sm text-slate-500">{task.category}</p>
        <h2 className="mt-2 text-3xl font-black">{task.title}</h2>
        <p className="mt-3 text-slate-600">{task.description || "No description provided."}</p>
        <div className="mt-6 grid gap-3 text-sm">
          <p><b>Deadline:</b> {new Date(task.deadline).toLocaleString()}</p>
          <p><b>Effort:</b> {task.estimated_hours} hours</p>
          <p><b>Status:</b> {task.status}</p>
          <p><b>Risk:</b> <RiskBadge value={plan.risk || "Medium"} /></p>
          <p><b>Priority Score:</b> {plan.analysis?.priority_score || "Analyzing"}</p>
          <p><b>Difficulty:</b> {plan.analysis?.difficulty || "Analyzing"}</p>
          <p><b>Success Probability:</b> {plan.analysis?.success_probability || "Analyzing"}%</p>
          <p><b>Confidence:</b> {plan.analysis?.confidence || "Analyzing"}%</p>
        </div>
        <Link className="btn btn-primary mt-6" to="/app/planner">Open Planner</Link>
      </section>
      <section className="card p-6">
        <h3 className="text-xl font-bold">AI Execution Plan</h3>
        <div className="mt-4 space-y-3">
          {(plan.execution_plan || []).map((item, index) => (
            <div key={`${item.time}-${index}`} className="rounded-lg border border-slate-200 p-3">
              <p className="font-semibold">{item.phase ? `${item.phase} - ${item.time}` : item.time}</p>
              <p className="text-sm text-slate-600">{item.action}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg bg-teal-50 p-4 text-teal-900">
          <p className="font-bold">Recommendation</p>
          <p>{plan.recommendation || "Generate an AI plan to get a recommendation."}</p>
        </div>
        <div className="mt-4 rounded-lg bg-slate-50 p-4 text-slate-700">
          <p className="font-bold">Reasoning</p>
          <p>{plan.analysis?.reasoning || plan.reasoning || "Risk reasoning will appear after analysis."}</p>
        </div>
        <div className="mt-4 rounded-lg bg-blue-50 p-4 text-blue-900">
          <p className="font-bold">Dependencies</p>
          <div className="mt-2 flex flex-wrap gap-2">{(plan.dependencies || plan.analysis?.dependencies || []).map((item) => <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-bold">{item}</span>)}</div>
        </div>
      </section>
    </div>
  );
}
