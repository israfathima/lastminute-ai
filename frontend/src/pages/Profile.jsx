import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="card max-w-2xl p-6">
      <h2 className="text-2xl font-black">Profile</h2>
      <div className="mt-6 space-y-3 text-sm">
        <p><b>Name:</b> {user?.displayName || "Demo Builder"}</p>
        <p><b>Email:</b> {user?.email || "demo@lastminute.ai"}</p>
        <p><b>Mode:</b> Deadline-first productivity coaching</p>
      </div>
    </div>
  );
}
