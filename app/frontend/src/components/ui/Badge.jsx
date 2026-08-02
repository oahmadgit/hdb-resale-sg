const TONES = {
  success: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-200',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  danger: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
  neutral: 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200',
};

function Badge({ children, tone = 'neutral' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-semibold ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export default Badge;
