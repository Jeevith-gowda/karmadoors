export default function Skeleton({ className = "w-full" }) {
  return (
    <div className={`h-4 rounded bg-slate-100 animate-pulse ${className}`} />
  );
}
