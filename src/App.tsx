import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { JourneyPage } from './pages/JourneyPage';
import { EthosPage } from './pages/EthosPage';
import { UcidAppRedirect } from './pages/UcidAppRedirect';
import { AITunerPage } from './pages/AITunerPage';
import { ContactPage } from './pages/ContactPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { PortfolioProjectPage } from './pages/PortfolioProjectPage';
import { SoftwarePage } from './pages/SoftwarePage';
import { SoftwareProjectPage } from './pages/SoftwareProjectPage';
import './App.css';

/** Content routes open at the top (banner). Home keeps its own scroll position. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    if (pathname === '/') return;
    const se = document.scrollingElement;
    if (se) se.scrollTop = 0;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return null;
}

function AppChrome() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div style={{ margin: 0, padding: 0, width: '100%', minHeight: '100vh' }}>
      <ScrollToTop />
      <Navigation />
      <main style={{ margin: 0, padding: 0 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:id" element={<PortfolioProjectPage />} />
          <Route path="/software" element={<SoftwarePage />} />
          <Route path="/software/:id" element={<SoftwareProjectPage />} />
          <Route path="/ethos" element={<EthosPage />} />
          <Route path="/ucid" element={<UcidAppRedirect />} />
          <Route path="/ai-tuner" element={<AITunerPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      {!isHome ? <Footer /> : null}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppChrome />
    </BrowserRouter>
  );
}

export default App;
