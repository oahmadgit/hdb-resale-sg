const VERDICT_CONFIG = {
  affordable: {
    tone: 'bg-green-50 text-green-800 ring-1 ring-inset ring-green-200 dark:bg-green-950/50 dark:text-green-400 dark:ring-green-900',
    icon: '🎉',
    label: 'Affordable',
    message: "You're in great shape — this home fits comfortably within your budget.",
  },
  borderline: {
    tone: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-900',
    icon: '⚖️',
    label: 'Borderline',
    message: "It's a stretch, but within reach — a bit more savings would ease the squeeze.",
  },
  unaffordable: {
    tone: 'bg-red-50 text-red-800 ring-1 ring-inset ring-red-200 dark:bg-red-950/50 dark:text-red-400 dark:ring-red-900',
    icon: '⚠️',
    label: 'Unaffordable',
    message: 'This one may be out of reach for now — consider a smaller flat type or a different town.',
  },
};

function VerdictBadge({ verdict }) {
  const config = VERDICT_CONFIG[verdict] ?? {
    tone: 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
    icon: 'ℹ️',
    label: verdict,
    message: '',
  };

  return (
    <div
      data-testid="verdict-banner"
      className={`flex items-center gap-3 rounded-2xl px-5 py-4 ${config.tone}`}
    >
      <span className="text-2xl" aria-hidden="true">
        {config.icon}
      </span>
      <div className="flex flex-col">
        <span className="text-xs font-bold uppercase tracking-wide">{config.label}</span>
        <span className="text-sm font-semibold">{config.message}</span>
      </div>
    </div>
  );
}

export default VerdictBadge;
