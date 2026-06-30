import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin() {
    await login();
    navigate("/app/dashboard");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <div className="card w-full max-w-md p-8">
        <div className="mb-8">
          <div className="mb-4 grid size-12 place-items-center rounded-lg bg-teal-500 font-black text-white">LM</div>
          <h1 className="text-3xl font-black">Sign in to LastMinute AI</h1>
          <p className="mt-2 text-slate-500">Connect your productivity cockpit and start planning before deadlines bite.</p>
        </div>
        <button className="btn btn-primary w-full" onClick={handleLogin}><LogIn size={18} /> Continue with Google</button>
      </div>
    </div>
  );
}
