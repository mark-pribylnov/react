import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AppProviders } from './app/AppProviders.tsx';
import './index.css';
import App from './App.tsx';
import ItemDetailsPanel from './components/ItemDetailsPanel/ItemDetailsPanel.tsx';
import AppLayout from './layouts/AppLayout.tsx';
import AboutPage from './pages/AboutPage/AboutPage.tsx';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<App />}>
              <Route path="details" element={<ItemDetailsPanel />} />
            </Route>
            <Route path="/about" element={<AboutPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  </StrictMode>
);
