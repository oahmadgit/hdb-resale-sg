function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-shadow dark:border-slate-800 dark:bg-slate-900 dark:shadow-none ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
