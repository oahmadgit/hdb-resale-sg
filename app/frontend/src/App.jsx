import { Navigate, Route, Routes } from 'react-router-dom';

import AffordabilityPage from './pages/AffordabilityPage';
import TrendsPage from './pages/TrendsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/affordability" replace />} />
      <Route path="/affordability" element={<AffordabilityPage />} />
      <Route path="/trends" element={<TrendsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
