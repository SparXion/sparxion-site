import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { JourneyPage } from './pages/JourneyPage';
import { EthosPage } from './pages/EthosPage';
import { UCIDPage } from './pages/UCIDPage';
import { AITunerPage } from './pages/AITunerPage';
import { ContactPage } from './pages/ContactPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { PortfolioProjectPage } from './pages/PortfolioProjectPage';
import { SoftwarePage } from './pages/SoftwarePage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div style={{ margin: 0, padding: 0, width: '100%', minHeight: '100vh' }}>
        <Navigation />
        <main style={{ margin: 0, padding: 0 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/:id" element={<PortfolioProjectPage />} />
            <Route path="/software" element={<SoftwarePage />} />
            <Route path="/ethos" element={<EthosPage />} />
            <Route path="/ucid" element={<UCIDPage />} />
            <Route path="/ai-tuner" element={<AITunerPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
