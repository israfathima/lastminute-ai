import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Wand2 } from "lucide-react";
import { api } from "../services/api";

export default function AddTask() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { priority: "Medium", category: "School", estimated_hours: 2, status: "To Do" },
  });
  const navigate = useNavigate();
  const [naturalText, setNaturalText] = useState("");
  const [created, setCreated] = useState([]);

  async function onSubmit(values) {
    const task = await api.createTask({ ...values, estimated_hours: Number(values.estimated_hours), deadline: new Date(values.deadline).toISOString() });
    navigate(`/app/tasks/${task.id}`);
  }

  async function createNatural() {
    const tasks = await api.createNaturalTasks(naturalText);
    setCreated(tasks);
    if (tasks[0]) navigate(`/app/tasks/${tasks[0].id}`);
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 xl:grid-cols-[1fr_.85fr]">
    <form className="card p-6" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-black">Add Task</h2>
      <div className="mt-6 grid gap-4">
        <label className="text-sm font-semibold">Task Title<input className="input mt-1" required {...register("title")} /></label>
        <label className="text-sm font-semibold">Description<textarea className="input mt-1 min-h-28" {...register("description")} /></label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold">Deadline<input className="input mt-1" type="datetime-local" required {...register("deadline")} /></label>
          <label className="text-sm font-semibold">Estimated Hours<input className="input mt-1" type="number" step="0.5" required {...register("estimated_hours")} /></label>
          <label className="text-sm font-semibold">Priority<select className="input mt-1" {...register("priority")}><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></label>
          <label className="text-sm font-semibold">Category<input className="input mt-1" {...register("category")} /></label>
        </div>
      </div>
      <button className="btn btn-primary mt-6" disabled={isSubmitting}><Save size={18} /> Save and Generate Plan</button>
    </form>
    <section className="glass p-6">
      <h2 className="text-2xl font-black">Natural Language Capture</h2>
      <p className="mt-2 text-sm text-slate-500">Type messy real-life commitments and Gemini turns them into structured tasks.</p>
      <textarea className="input mt-5 min-h-56" value={naturalText} onChange={(event) => setNaturalText(event.target.value)} placeholder="I have an interview Friday at 3. Finish AI assignment tomorrow. Gym every evening. Pay electricity bill Monday." />
      <button className="btn btn-primary mt-4" type="button" disabled={!naturalText.trim()} onClick={createNatural}><Wand2 size={18} /> Create Tasks</button>
      <div className="mt-4 space-y-2">
        {created.map((task) => <p key={task.id} className="rounded-lg bg-white/80 p-3 text-sm font-semibold">{task.title}</p>)}
      </div>
    </section>
    </div>
  );
}
