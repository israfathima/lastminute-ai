import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, BookOpen, Brain, CalendarPlus, Crosshair, FileText, Focus, GitBranch, LayoutDashboard, LogOut, Settings, Sparkles, User } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { setApiUser } from "../services/api";
import AICoach from "./AICoach";

const links = [
  ["Dashboard", "/app/dashboard", LayoutDashboard],
  ["Add Task", "/app/add-task", CalendarPlus],
  ["AI Planner", "/app/planner", Brain],
  ["Focus Mode", "/app/focus", Focus],
  ["AI Insights", "/app/insights", Sparkles],
  ["Analytics", "/app/analytics", BarChart3],
  ["Architecture", "/app/architecture", GitBranch],
  ["AI Workflow", "/app/ai-workflow", Crosshair],
  ["Google Tech", "/app/google-tech", BookOpen],
  ["About", "/app/about", FileText],
  ["Profile", "/app/profile", User],
  ["Settings", "/app/settings", Settings],
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => setApiUser(user), [user]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ccfbf1,transparent_32%),linear-gradient(135deg,#f8fafc,#eff6ff_48%,#f8fafc)] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/70 bg-white/80 p-4 shadow-xl shadow-slate-200/60 backdrop-blur lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-teal-500 font-black text-white">LM</div>
          <div>
            <p className="font-bold">LastMinute AI</p>
            <p className="text-xs text-slate-500">Proactive productivity</p>
          </div>
        </div>
        <nav className="max-h-[calc(100vh-7rem)] space-y-1 overflow-y-auto pr-1">
          {links.map(([label, href, Icon]) => (
            <NavLink key={href} to={href} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-slate-50"}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur lg:px-8">
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h1 className="text-xl font-bold">{user?.displayName || "Focused human"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary lg:hidden" onClick={() => navigate("/app/add-task")}><CalendarPlus size={18} /></button>
            <button className="btn btn-secondary" onClick={logout}><LogOut size={18} /> Sign out</button>
          </div>
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-white/70 bg-white/60 px-4 py-2 backdrop-blur lg:hidden">
          {links.slice(0, 8).map(([label, href]) => (
            <NavLink key={href} to={href} className={({ isActive }) => `shrink-0 rounded-lg px-3 py-2 text-xs font-bold ${isActive ? "bg-teal-500 text-white" : "bg-white text-slate-600"}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mx-auto max-w-7xl p-4 lg:p-8">
          <Outlet />
        </div>
        <AICoach userName={user?.displayName || "there"} />
      </main>
    </div>
  );
}
