import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold text-slate-900">404</h1>
      <p className="text-slate-600">Page not found</p>
      <Link to="/affordability" className="text-blue-600 underline hover:text-blue-800">
        Back to the Affordability Calculator
      </Link>
    </div>
  );
}

export default NotFoundPage;
