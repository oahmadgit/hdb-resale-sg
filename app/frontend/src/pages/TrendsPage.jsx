import { useState } from 'react';

import FilterBar from '../components/trends/FilterBar';
import KpiCards from '../components/trends/KpiCards';
import PriceTrendChart from '../components/trends/PriceTrendChart';
import VolumeChart from '../components/trends/VolumeChart';
import { useTrends } from '../hooks/useTrends';

const DEFAULT_FILTERS = {
  towns: [],
  flatType: '',
  from: '',
  to: '',
  storeyRange: '',
};

function TrendsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { data, isLoading, isError } = useTrends(filters);

  const hasTowns = filters.towns.length > 0;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Market Trend Dashboard</h1>

      <FilterBar filters={filters} onChange={setFilters} />

      {!hasTowns && (
        <p className="text-sm text-slate-500">Select at least one town to see trends.</p>
      )}

      {hasTowns && isError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          Something went wrong loading trends. Please try again.
        </p>
      )}

      {hasTowns && !isError && (
        <>
          <KpiCards kpis={data?.kpis} isLoading={isLoading} />
          <PriceTrendChart series={data?.series ?? []} />
          <VolumeChart series={data?.series ?? []} />
        </>
      )}
    </div>
  );
}

export default TrendsPage;
