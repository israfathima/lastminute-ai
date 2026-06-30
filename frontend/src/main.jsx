import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./styles.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import AppShell from "./components/AppShell.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
const Landing = lazy(() => import("./pages/Landing.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const AddTask = lazy(() => import("./pages/AddTask.jsx"));
const TaskDetails = lazy(() => import("./pages/TaskDetails.jsx"));
const AIPlanner = lazy(() => import("./pages/AIPlanner.jsx"));
const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const FocusMode = lazy(() => import("./pages/FocusMode.jsx"));
const Insights = lazy(() => import("./pages/Insights.jsx"));
const ProjectInfo = lazy(() => import("./pages/ProjectInfo.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

function PageLoader() {
  return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="card h-32 w-80 animate-pulse" /></div>;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
                <Route path="/app/dashboard" element={<Dashboard />} />
                <Route path="/app/add-task" element={<AddTask />} />
                <Route path="/app/tasks/:id" element={<TaskDetails />} />
                <Route path="/app/planner" element={<AIPlanner />} />
                <Route path="/app/focus" element={<FocusMode />} />
                <Route path="/app/insights" element={<Insights />} />
                <Route path="/app/analytics" element={<Analytics />} />
                <Route path="/app/architecture" element={<ProjectInfo type="architecture" />} />
                <Route path="/app/ai-workflow" element={<ProjectInfo type="workflow" />} />
                <Route path="/app/google-tech" element={<ProjectInfo type="google" />} />
                <Route path="/app/about" element={<ProjectInfo type="about" />} />
                <Route path="/app/profile" element={<Profile />} />
                <Route path="/app/settings" element={<Settings />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);
