import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-center dark:bg-slate-950">
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-50">404</h1>
      <p className="text-slate-500 dark:text-slate-400">Page not found</p>
      <Link
        to="/"
        className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Back to HDB Resale Explorer
      </Link>
    </div>
  );
}

export default NotFoundPage;
