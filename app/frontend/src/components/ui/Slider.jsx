import { forwardRef } from 'react';

const Slider = forwardRef(function Slider(
  { label, value, min, max, step = 1, onChange, formatValue, id, ...props },
  ref
) {
  const sliderId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-sm">
        <label htmlFor={sliderId} className="font-semibold text-slate-700">
          {label}
        </label>
        <span className="font-semibold text-brand-600">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input
        ref={ref}
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-600"
        {...props}
      />
    </div>
  );
});

export default Slider;
