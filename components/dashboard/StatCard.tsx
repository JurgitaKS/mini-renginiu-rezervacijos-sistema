type StatCardProps = {
  label: string;
  value: number;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="app-content-card justify-center">
      <p className="text-sm text-app-text-muted">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums text-app-text">{value}</p>
    </div>
  );
}
