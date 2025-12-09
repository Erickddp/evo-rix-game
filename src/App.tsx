import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Play } from './pages/Play';
import { TetrixPage } from './pages/TetrixPage';
import { FitPage } from './pages/FitPage';
import { Progress } from './pages/Progress';
import { Recommendations } from './pages/Recommendations';
import { About } from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jugar" element={<Play />} />
            <Route path="/jugar/tetrix" element={<TetrixPage />} />
            <Route path="/jugar/fit" element={<FitPage />} />
            <Route path="/progreso" element={<Progress />} />
            <Route path="/recomendaciones" element={<Recommendations />} />
            <Route path="/acerca-de" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;


