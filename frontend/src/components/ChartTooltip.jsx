import { currency } from "../lib/categories.js";

export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="tip">
      <p className="tip__label">{label || payload[0].name}</p>
      {payload.map((p, i) => (
        <p key={i} className="tip__row">
          <span className="tip__dot" style={{ background: p.color || p.payload?.fill }} />
          <span className="tip__name">{p.name}</span>
          <span className="tip__val">{currency(p.value)}</span>
        </p>
      ))}
    </div>
  );
}
