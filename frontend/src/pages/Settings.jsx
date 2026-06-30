import { Moon, Bell, Calendar } from "lucide-react";

export default function Settings() {
  return (
    <div className="card max-w-3xl p-6">
      <h2 className="text-2xl font-black">Settings</h2>
      <div className="mt-6 divide-y divide-slate-200">
        {[[Bell, "Context-aware reminders"], [Calendar, "Calendar planning mode"], [Moon, "Dark mode preference"]].map(([Icon, label]) => (
          <label key={label} className="flex items-center justify-between py-4">
            <span className="flex items-center gap-3 font-semibold"><Icon size={18} className="text-teal-600" /> {label}</span>
            <input type="checkbox" className="size-5 accent-teal-500" defaultChecked />
          </label>
        ))}
      </div>
    </div>
  );
}
