import { forwardRef } from 'react';

const Slider = forwardRef(function Slider(
  { label, value, min, max, step = 1, onChange, formatValue, id, ...props },
  ref
) {
  const sliderId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm font-medium text-slate-700">
        <label htmlFor={sliderId}>{label}</label>
        <span>{formatValue ? formatValue(value) : value}</span>
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
        className="w-full accent-blue-600"
        {...props}
      />
    </div>
  );
});

export default Slider;
