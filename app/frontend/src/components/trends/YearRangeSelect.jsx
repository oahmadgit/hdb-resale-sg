const MAX_YEAR_SPAN = 5;

function YearRangeSelect({ years, fromYear, toYear, onChange }) {
  if (years.length === 0) return null;

  function handleFromChange(event) {
    const nextFrom = Number(event.target.value);
    const maxTo = years[years.length - 1];
    const clampedTo = Math.min(Math.max(toYear, nextFrom), nextFrom + MAX_YEAR_SPAN - 1, maxTo);
    onChange({ fromYear: nextFrom, toYear: clampedTo });
  }

  function handleToChange(event) {
    const nextTo = Number(event.target.value);
    const minYear = years[0];
    const clampedFrom = Math.max(Math.min(fromYear, nextTo), nextTo - MAX_YEAR_SPAN + 1, minYear);
    onChange({ fromYear: clampedFrom, toYear: nextTo });
  }

  const selectClass =
    'rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200';

  return (
    <div className="flex items-center gap-1.5">
      <select
        aria-label="From year"
        className={selectClass}
        value={fromYear}
        onChange={handleFromChange}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <span className="text-xs text-slate-400 dark:text-slate-500">–</span>
      <select aria-label="To year" className={selectClass} value={toYear} onChange={handleToChange}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

export { MAX_YEAR_SPAN };
export default YearRangeSelect;
