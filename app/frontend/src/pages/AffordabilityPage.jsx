import AffordabilityForm from '../components/affordability/AffordabilityForm';
import AffordabilityResult from '../components/affordability/AffordabilityResult';
import { useAffordability } from '../hooks/useAffordability';

function AffordabilityPage() {
  const { calculate, data, isPending, isError, isSuccess } = useAffordability();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Affordability Calculator</h1>

      <AffordabilityForm onSubmit={calculate} isPending={isPending} />

      {isError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          Something went wrong calculating affordability. Please try again.
        </p>
      )}

      {isSuccess && <AffordabilityResult result={data} />}
    </div>
  );
}

export default AffordabilityPage;
