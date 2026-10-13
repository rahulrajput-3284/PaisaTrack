export default function StatCard({ icon: Icon, label, value, hint, tone = "accent" }) {
  return (
    <article className="stat">
      <span className={`stat__icon stat__icon--${tone}`}>
        <Icon size={17} />
      </span>
      <div className="stat__body">
        <p className="stat__label">{label}</p>
        <p className="stat__value">{value}</p>
        {hint && <p className="stat__hint">{hint}</p>}
      </div>
    </article>
  );
}
