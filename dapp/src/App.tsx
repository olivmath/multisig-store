import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import WalletPage from './pages/WalletPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        expand={false}
        richColors
        closeButton
      />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet/:id" element={<WalletPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
