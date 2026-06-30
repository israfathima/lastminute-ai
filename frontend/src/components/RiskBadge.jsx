const tones = {
  Low: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-orange-50 text-orange-700",
  Critical: "bg-rose-50 text-rose-700",
};

export default function RiskBadge({ value }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tones[value] || tones.Medium}`}>{value}</span>;
}
