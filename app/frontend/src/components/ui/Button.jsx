function Button({ children, type = 'button', variant = 'primary', className = '', ...props }) {
  const variants = {
    primary:
      'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 disabled:bg-brand-200 shadow-sm hover:shadow-card',
    secondary:
      'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:text-slate-300',
    ghost: 'bg-transparent text-brand-600 hover:bg-brand-50 disabled:text-slate-300',
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
