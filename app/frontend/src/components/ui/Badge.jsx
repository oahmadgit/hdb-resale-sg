const TONES = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  neutral: 'bg-slate-100 text-slate-800',
};

function Badge({ children, tone = 'neutral' }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${TONES[tone]}`}>
      {children}
    </span>
  );
}

export default Badge;
