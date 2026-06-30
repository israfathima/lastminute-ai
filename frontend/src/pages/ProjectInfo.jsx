const content = {
  architecture: {
    title: "Architecture",
    intro: "LastMinute AI separates agentic planning, risk analysis, storage, and UI into clean deployable layers.",
    cards: ["React + Vite premium dashboard", "FastAPI service layer", "Gemini agent for structured decisions", "Firebase Auth and Firestore", "Cloud Run containers"],
  },
  workflow: {
    title: "AI Workflow",
    intro: "The AI agent observes tasks, scores risk, predicts failure points, builds schedules, and continuously recommends the next action.",
    cards: ["Task ingestion", "Gemini structured analysis", "Deadline risk engine", "Daily plan optimizer", "Coach recommendations"],
  },
  google: {
    title: "Google Technologies",
    intro: "The product is designed around Google AI and cloud primitives for a credible hackathon deployment story.",
    cards: ["Gemini API", "Firebase Authentication", "Firestore", "Google Cloud Run", "Cloud Build"],
  },
  about: {
    title: "About LastMinute AI",
    intro: "A productivity companion for students, professionals, and entrepreneurs who need action before reminders become emergencies.",
    cards: ["Agentic productivity", "Natural language capture", "Focus mode", "Risk-aware scheduling", "Weekly AI insights"],
  },
};

export default function ProjectInfo({ type }) {
  const item = content[type] || content.about;
  return (
    <div className="space-y-6">
      <section className="glass p-8">
        <p className="text-sm font-bold uppercase tracking-wider text-teal-700">Hackathon Story</p>
        <h2 className="mt-2 text-4xl font-black">{item.title}</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{item.intro}</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {item.cards.map((card) => <div key={card} className="metric"><p className="font-bold">{card}</p></div>)}
      </section>
    </div>
  );
}
