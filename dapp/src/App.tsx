import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import WalletPage from './pages/WalletPage';
import NotFound from './pages/NotFound';
import { TutorialPage } from './tutorial';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet/:id" element={<WalletPage />} />
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
