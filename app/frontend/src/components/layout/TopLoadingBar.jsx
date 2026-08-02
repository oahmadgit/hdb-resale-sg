import { useIsFetching, useIsMutating } from '@tanstack/react-query';

function TopLoadingBar() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const active = isFetching + isMutating > 0;

  return (
    <div
      role="progressbar"
      aria-hidden={!active}
      aria-label="Loading"
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-transparent transition-opacity duration-300 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {active && (
        <div className="h-full w-1/3 animate-loading-bar rounded-full bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400" />
      )}
    </div>
  );
}

export default TopLoadingBar;
