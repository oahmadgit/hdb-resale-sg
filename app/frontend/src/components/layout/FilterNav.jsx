import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Button from '../ui/Button';
import { FLAT_TYPES } from '../../constants/flatTypes';

const filterSchema = z.object({
  flatType: z.enum(FLAT_TYPES),
  income: z.number().min(1000).max(30000),
  savings: z.number().min(0),
  tenure: z.number().min(5).max(30),
});

const INCOME_OPTIONS = [1000, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 15000, 20000, 30000];
const SAVINGS_OPTIONS = [0, 10000, 25000, 50000, 75000, 100000, 150000, 200000, 300000, 500000];
const TENURE_OPTIONS = [5, 10, 15, 20, 25, 30];

const fieldClass =
  'w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100';
const labelClass = 'text-xs font-semibold text-slate-500';

function currencyLabel(value) {
  return `$${value.toLocaleString()}`;
}

function FilterNav({ onSubmit, isPending = false, selectedTowns = [] }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      income: 6000,
      savings: 50000,
      flatType: '4 ROOM',
      tenure: 25,
    },
  });

  const [attemptedWithoutTowns, setAttemptedWithoutTowns] = useState(false);

  function submit(data) {
    if (selectedTowns.length === 0) {
      setAttemptedWithoutTowns(true);
      return;
    }
    setAttemptedWithoutTowns(false);
    onSubmit({ ...data, towns: selectedTowns });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:items-end">
        <div className="flex flex-col gap-1">
          <label htmlFor="flatType" className={labelClass}>
            Flat type
          </label>
          <select id="flatType" className={fieldClass} {...register('flatType')}>
            {FLAT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="income" className={labelClass}>
            Income ($/mo)
          </label>
          <Controller
            name="income"
            control={control}
            render={({ field }) => (
              <select
                id="income"
                className={fieldClass}
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
              >
                {INCOME_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {currencyLabel(value)}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="savings" className={labelClass}>
            Savings ($)
          </label>
          <Controller
            name="savings"
            control={control}
            render={({ field }) => (
              <select
                id="savings"
                className={fieldClass}
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
              >
                {SAVINGS_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {currencyLabel(value)}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="tenure" className={labelClass}>
            Tenure (yrs)
          </label>
          <Controller
            name="tenure"
            control={control}
            render={({ field }) => (
              <select
                id="tenure"
                className={fieldClass}
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
              >
                {TENURE_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value} yrs
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending} className="h-9 w-full">
          {isPending ? 'Calculating…' : 'Calculate'}
        </Button>
      </div>

      {attemptedWithoutTowns && (
        <p className="text-xs font-medium text-red-600">Select at least one town</p>
      )}
      {errors.flatType && (
        <p className="text-xs font-medium text-red-600">{errors.flatType.message}</p>
      )}
    </form>
  );
}

export default FilterNav;
