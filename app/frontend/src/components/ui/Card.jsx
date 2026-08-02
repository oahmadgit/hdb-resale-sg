function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-shadow ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
