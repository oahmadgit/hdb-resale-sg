import { useEffect, useRef, useState } from 'react';

import { TOWNS } from '../../constants/towns';

function TownSelect({ value = [], onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function toggleTown(town) {
    if (value.includes(town)) {
      onChange(value.filter((t) => t !== town));
    } else {
      onChange([...value, town]);
    }
  }

  const summary = value.length === 0 ? 'Select town(s)' : value.length === 1 ? value[0] : `${value.length} towns`;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-100 ${
          open
            ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-950/50 dark:text-brand-400'
            : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-brand-500 dark:hover:text-brand-400'
        }`}
      >
        {summary}
        <span
          className={`text-xs transition-transform ${
            open ? 'rotate-180 text-brand-500' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card-hover dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Select town(s)
            </p>
          </div>
          <ul role="listbox" aria-label="Town(s)" className="max-h-72 overflow-y-auto p-1.5">
            {TOWNS.map((town) => {
              const checked = value.includes(town);
              return (
                <li key={town}>
                  <label
                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${
                      checked
                        ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/50 dark:text-brand-400'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTown(town)}
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-100 dark:border-slate-600 dark:bg-slate-700"
                    />
                    {town}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TownSelect;
