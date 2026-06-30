import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Pause, Play, RotateCcw } from "lucide-react";
import { api } from "../services/api";

export default function FocusMode() {
  const [tasks, setTasks] = useState([]);
  const [taskId, setTaskId] = useState("");
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => { api.tasks().then((items) => { setTasks(items); setTaskId(items[0]?.id || ""); }); }, []);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [running]);

  const task = useMemo(() => tasks.find((item) => item.id === taskId), [tasks, taskId]);
  const progress = Math.round(((25 * 60 - seconds) / (25 * 60)) * 100);
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  async function completeTask() {
    if (!task) return;
    const updated = await api.updateTask(task.id, { status: "Completed" });
    setTasks((items) => items.map((item) => item.id === updated.id ? updated : item));
  }

  return (
    <div className="mx-auto max-w-4xl">
      <section className="glass p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-teal-700">Focus Mode</p>
        <select className="input mx-auto mt-4 max-w-xl" value={taskId} onChange={(event) => setTaskId(event.target.value)}>
          {tasks.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
        <h2 className="mt-8 text-3xl font-black">{task?.title || "Choose one task"}</h2>
        <p className="mt-3 text-slate-500">{task?.ai_plan?.recommendation || "One task, one timer, no noise."}</p>
        <div className="mx-auto mt-8 grid size-72 place-items-center rounded-full border-[14px] border-teal-100 bg-white shadow-inner">
          <div>
            <p className="text-6xl font-black">{minutes}:{secs}</p>
            <p className="mt-2 text-sm text-slate-500">{progress}% focus block complete</p>
          </div>
        </div>
        <div className="mx-auto mt-6 h-3 max-w-xl overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button className="btn btn-primary" onClick={() => setRunning((value) => !value)}>{running ? <Pause size={18} /> : <Play size={18} />} {running ? "Pause" : "Start"}</button>
          <button className="btn btn-secondary" onClick={() => { setSeconds(25 * 60); setRunning(false); }}><RotateCcw size={18} /> Reset</button>
          <button className="btn btn-secondary" onClick={completeTask}><CheckCircle2 size={18} /> Mark Done</button>
        </div>
        <blockquote className="mt-8 text-lg font-semibold text-slate-700">Small visible progress now beats a stressful rescue later.</blockquote>
      </section>
    </div>
  );
}
