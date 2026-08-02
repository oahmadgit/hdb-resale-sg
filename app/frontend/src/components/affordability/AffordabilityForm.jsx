import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Button from '../ui/Button';
import Slider from '../ui/Slider';
import { TOWNS } from '../../constants/towns';
import { FLAT_TYPES } from '../../constants/flatTypes';
import { formatCurrency } from '../../utils/formatters';

const affordabilitySchema = z.object({
  income: z.number().min(1000).max(30000),
  savings: z.number().min(0),
  towns: z.array(z.string()).min(1, 'Select at least one town'),
  flatType: z.enum(FLAT_TYPES),
  tenure: z.number().min(5).max(30),
});

const DEFAULT_VALUES = {
  income: 6000,
  savings: 50000,
  towns: [],
  flatType: '4 ROOM',
  tenure: 25,
};

function AffordabilityForm({ onSubmit, isPending = false }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(affordabilitySchema),
    defaultValues: DEFAULT_VALUES,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="towns" className="text-sm font-medium text-slate-700">
          Town(s)
        </label>
        <select
          id="towns"
          multiple
          className="h-32 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          {...register('towns')}
        >
          {TOWNS.map((town) => (
            <option key={town} value={town}>
              {town}
            </option>
          ))}
        </select>
        {errors.towns && <p className="text-sm text-red-600">{errors.towns.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="flatType" className="text-sm font-medium text-slate-700">
          Flat type
        </label>
        <select
          id="flatType"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          {...register('flatType')}
        >
          {FLAT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <Controller
        name="income"
        control={control}
        render={({ field }) => (
          <Slider
            label="Monthly household income"
            min={1000}
            max={30000}
            step={100}
            formatValue={formatCurrency}
            {...field}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />

      <Controller
        name="savings"
        control={control}
        render={({ field }) => (
          <Slider
            label="Savings"
            min={0}
            max={500000}
            step={5000}
            formatValue={formatCurrency}
            {...field}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />

      <Controller
        name="tenure"
        control={control}
        render={({ field }) => (
          <Slider
            label="Loan tenure (years)"
            min={5}
            max={30}
            step={1}
            {...field}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Calculating…' : 'Calculate'}
      </Button>
    </form>
  );
}

export default AffordabilityForm;
