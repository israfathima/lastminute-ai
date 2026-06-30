import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  timeout: 12000,
});

client.interceptors.response.use(undefined, async (error) => {
  const config = error.config || {};
  config.__retryCount = config.__retryCount || 0;
  const canRetry = config.__retryCount < 2 && (!config.method || config.method.toLowerCase() === "get");
  if (!canRetry) return Promise.reject(error);
  config.__retryCount += 1;
  await new Promise((resolve) => setTimeout(resolve, 300 * config.__retryCount));
  return client(config);
});

export function setApiUser(user) {
  client.defaults.headers.common["X-User-Id"] = user?.uid || "demo-user";
}

export const api = {
  tasks: () => client.get("/tasks").then((res) => res.data),
  task: (id) => client.get(`/tasks/${id}`).then((res) => res.data),
  createTask: (payload) => client.post("/tasks", payload).then((res) => res.data),
  updateTask: (id, payload) => client.put(`/tasks/${id}`, payload).then((res) => res.data),
  deleteTask: (id) => client.delete(`/tasks/${id}`),
  generatePlan: (taskId) => client.post("/generate-plan", { task_id: taskId }).then((res) => res.data),
  dashboard: () => client.get("/dashboard").then((res) => res.data),
  analytics: () => client.get("/analytics").then((res) => res.data),
  commandCenter: (userName) => client.get("/agent/command-center", { params: { user_name: userName || "there" } }).then((res) => res.data),
  dailyPlan: () => client.get("/agent/daily-plan").then((res) => res.data),
  insights: () => client.get("/agent/insights").then((res) => res.data),
  createNaturalTasks: (text) => client.post("/agent/natural-language-tasks", { text }).then((res) => res.data),
};
