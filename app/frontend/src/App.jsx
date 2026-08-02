import { Navigate, Route, Routes } from 'react-router-dom';

import TopLoadingBar from './components/layout/TopLoadingBar';
import PropertyExplorerPage from './pages/PropertyExplorerPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <>
      <TopLoadingBar />
      <Routes>
        <Route path="/" element={<PropertyExplorerPage />} />
        <Route path="/affordability" element={<Navigate to="/#calculator" replace />} />
        <Route path="/trends" element={<Navigate to="/#trends" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
