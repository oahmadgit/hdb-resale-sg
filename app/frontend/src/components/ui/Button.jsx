import Spinner from './Spinner';

function Button({
  children,
  type = 'button',
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) {
  const variants = {
    primary:
      'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 disabled:bg-brand-200 shadow-sm hover:shadow-card dark:disabled:bg-brand-900',
    secondary:
      'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:text-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 dark:disabled:text-slate-600',
    ghost:
      'bg-transparent text-brand-600 hover:bg-brand-50 disabled:text-slate-300 dark:text-brand-400 dark:hover:bg-brand-950/50 dark:disabled:text-slate-600',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}

export default Button;
