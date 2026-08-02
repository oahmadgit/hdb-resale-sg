import { TOWNS } from '../../constants/towns';
import { FLAT_TYPES } from '../../constants/flatTypes';
import { STOREY_RANGES } from '../../constants/storeyRanges';

function FilterBar({ filters, onChange }) {
  function updateField(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="trends-towns" className="text-sm font-medium text-slate-700">
          Town(s)
        </label>
        <select
          id="trends-towns"
          multiple
          className="h-32 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          value={filters.towns}
          onChange={(e) =>
            updateField(
              'towns',
              Array.from(e.target.selectedOptions).map((o) => o.value)
            )
          }
        >
          {TOWNS.map((town) => (
            <option key={town} value={town}>
              {town}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="trends-flatType" className="text-sm font-medium text-slate-700">
          Flat type
        </label>
        <select
          id="trends-flatType"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          value={filters.flatType}
          onChange={(e) => updateField('flatType', e.target.value)}
        >
          <option value="">All</option>
          {FLAT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="trends-from" className="text-sm font-medium text-slate-700">
          From
        </label>
        <input
          id="trends-from"
          type="month"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          value={filters.from}
          onChange={(e) => updateField('from', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="trends-to" className="text-sm font-medium text-slate-700">
          To
        </label>
        <input
          id="trends-to"
          type="month"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          value={filters.to}
          onChange={(e) => updateField('to', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="trends-storeyRange" className="text-sm font-medium text-slate-700">
          Storey range
        </label>
        <select
          id="trends-storeyRange"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          value={filters.storeyRange}
          onChange={(e) => updateField('storeyRange', e.target.value)}
        >
          <option value="">All</option>
          {STOREY_RANGES.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
