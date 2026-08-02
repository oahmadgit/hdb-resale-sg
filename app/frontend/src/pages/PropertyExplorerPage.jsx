import { useState } from 'react';

import Header from '../components/layout/Header';
import TownSelect from '../components/layout/TownSelect';
import FilterNav from '../components/layout/FilterNav';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import VerdictBadge from '../components/affordability/VerdictBadge';
import MortgageBreakdown from '../components/affordability/MortgageBreakdown';
import GrantEligibility from '../components/affordability/GrantEligibility';
import ComparableTransactions from '../components/affordability/ComparableTransactions';
import KpiCards from '../components/trends/KpiCards';
import PriceTrendChart from '../components/trends/PriceTrendChart';
import VolumeChart from '../components/trends/VolumeChart';
import { useAffordability } from '../hooks/useAffordability';
import { useTrends } from '../hooks/useTrends';
import { TOWNS } from '../constants/towns';

function PropertyExplorerPage() {
  const [selectedTowns, setSelectedTowns] = useState([TOWNS[0]]);

  const affordability = useAffordability();
  const trends = useTrends({ towns: selectedTowns });

  const hasTowns = selectedTowns.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header townSelect={<TownSelect value={selectedTowns} onChange={setSelectedTowns} />} />

      <section className="bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700 px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Find out what you can afford — and where
          </h1>
          <p className="mt-3 max-w-2xl text-brand-50">
            Explore HDB resale prices across Singapore. Pick your towns once, and see your
            affordability verdict alongside live market trends for the same area.
          </p>
        </div>
      </section>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-10">
        <section id="calculator" className="scroll-mt-20">
          <Card className="mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Showing trends for:
              </span>
              {hasTowns ? (
                selectedTowns.map((town) => (
                  <Badge key={town} tone="neutral">
                    {town}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-slate-400 dark:text-slate-500">
                  Select a town above to see trends.
                </span>
              )}
            </div>
          </Card>

          {hasTowns && trends.isError && (
            <p className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 dark:bg-red-950/50 dark:text-red-400">
              Something went wrong loading trends. Please try again.
            </p>
          )}

          {hasTowns && !trends.isError && (
            <div className="mb-6">
              <KpiCards kpis={trends.data?.kpis} isLoading={trends.isLoading} />
            </div>
          )}

          {hasTowns && !trends.isError && (
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <PriceTrendChart series={trends.data?.series ?? []} />
              <VolumeChart series={trends.data?.series ?? []} />
            </div>
          )}

          <Card className="mb-6">
            <FilterNav
              onSubmit={affordability.calculate}
              isPending={affordability.isPending}
              selectedTowns={selectedTowns}
            />
          </Card>

          {affordability.isError && (
            <p className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 dark:bg-red-950/50 dark:text-red-400">
              Something went wrong calculating affordability. Please try again.
            </p>
          )}

          {affordability.isSuccess ? (
            <div className="flex flex-col gap-6">
              <VerdictBadge verdict={affordability.data.verdict} />

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-6">
                  <MortgageBreakdown
                    medianPrice={affordability.data.medianPrice}
                    downpaymentRequired={affordability.data.downpaymentRequired}
                    loanAmount={affordability.data.loanAmount}
                    monthlyMortgage={affordability.data.monthlyMortgage}
                    mortgageToIncomeRatio={affordability.data.mortgageToIncomeRatio}
                  />
                  <GrantEligibility
                    eligible={affordability.data.grantEligibility.eligible}
                    grantAmount={affordability.data.grantEligibility.grantAmount}
                    effectiveLoanAmount={affordability.data.grantEligibility.effectiveLoanAmount}
                  />
                </div>

                <div className="lg:sticky lg:top-40">
                  <ComparableTransactions comparables={affordability.data.comparables} />
                </div>
              </div>
            </div>
          ) : (
            !affordability.isError && (
              <Card className="flex items-center justify-center py-16 text-center">
                <p className="text-slate-400 dark:text-slate-500">
                  Fill in the filters above and hit <span className="font-semibold">Calculate</span>{' '}
                  to see your affordability breakdown here.
                </p>
              </Card>
            )
          )}
        </section>
      </main>
    </div>
  );
}

export default PropertyExplorerPage;
