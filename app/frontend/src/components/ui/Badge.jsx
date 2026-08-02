const TONES = {
  success:
    'bg-green-50 text-green-700 ring-1 ring-inset ring-green-200 dark:bg-green-950/50 dark:text-green-400 dark:ring-green-900',
  warning:
    'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-900',
  danger:
    'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-950/50 dark:text-red-400 dark:ring-red-900',
  neutral:
    'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
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
