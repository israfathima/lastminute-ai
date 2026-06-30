import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center">
      <div>
        <p className="text-7xl font-black text-teal-500">404</p>
        <h1 className="mt-4 text-2xl font-bold">This deadline does not exist.</h1>
        <Link className="btn btn-primary mt-6" to="/app/dashboard">Back to dashboard</Link>
      </div>
    </div>
  );
}
