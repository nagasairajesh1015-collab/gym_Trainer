export default function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="card stat"><Icon size={18} /><strong>{value}</strong><span>{label}</span></div>
  );
}
