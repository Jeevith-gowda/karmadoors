import Skeleton from "./Skeleton";
import EmptyState from "./EmptyState";

export default function Table({ cols, rows, loading, emptyMsg }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50">
            {cols.map((c) => (
              <th key={c} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200 whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {cols.map((c) => (
                  <td key={c} className="px-4 py-3 border-b border-slate-100">
                    <Skeleton className={i % 2 === 0 ? "w-4/5" : "w-3/5"} />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={cols.length}>
                <EmptyState msg={emptyMsg || "No data found"} />
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className={`px-4 py-3 border-b border-slate-100 ${j === 0 ? "font-semibold text-slate-900" : "text-slate-600"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
