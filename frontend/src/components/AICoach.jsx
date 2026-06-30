import { useEffect, useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import { api } from "../services/api";

export default function AICoach({ userName }) {
  const [tip, setTip] = useState("Analyzing your workload...");

  useEffect(() => {
    let active = true;
    api.commandCenter(userName).then((data) => {
      if (active) setTip(data.next_best_action || data.recommendation);
    }).catch(() => setTip("Protect one focused block and start with the riskiest task."));
    const timer = setInterval(() => {
      api.commandCenter(userName).then((data) => active && setTip(data.energy_recommendation || data.next_best_action)).catch(() => {});
    }, 45000);
    return () => { active = false; clearInterval(timer); };
  }, [userName]);

  return (
    <div className="fixed bottom-5 right-5 z-30 hidden w-80 rounded-lg border border-teal-200 bg-white/90 p-4 shadow-2xl shadow-teal-900/10 backdrop-blur xl:block">
      <div className="mb-2 flex items-center gap-2 font-bold"><Bot size={18} className="text-teal-600" /> AI Coach <Sparkles size={14} className="text-blue-600" /></div>
      <p className="text-sm leading-6 text-slate-600">{tip}</p>
    </div>
  );
}
