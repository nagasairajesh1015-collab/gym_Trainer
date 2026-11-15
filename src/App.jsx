import { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Workouts from './pages/Workouts.jsx';
import CalendarPage from './pages/Calendar.jsx';
import Classes from './pages/Classes.jsx';
import Features from './pages/Features.jsx';
import Diet from './pages/Diet.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TabBar from './components/TabBar.jsx';
import Quote from './components/Quote.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { useLocalStorage } from './hooks/useLocalStorage.js';

export default function App() {
  const [page, setPage] = useState('Home');
  const [level, setLevel] = useLocalStorage('gt:level', 'beginner');
  const [completed, setCompleted] = useLocalStorage('gt:completed', {}); // { 'YYYY-MM-DD': { level, day } }
  const [storageOk] = useState(() => { try { localStorage.setItem('gt:t', '1'); localStorage.removeItem('gt:t'); return true; } catch { return false; } });
  useEffect(() => {
    window.__goBack = () => { if (page !== 'Home') { setPage('Home'); window.scrollTo({ top: 0 }); return true; } return false; };
    return () => { delete window.__goBack; };
  }, [page]);
  return (
    <>
      <Navbar page={page} onNavigate={setPage} />
      {!storageOk && <div className="banner">Progress can’t be saved in this browser (storage is blocked). It will reset when you close the tab.</div>}
      <ErrorBoundary key={page}>
      {page === 'Home' && <Home level={level} setLevel={setLevel} completed={completed} onNavigate={setPage} />}
      {page === 'Classes' && <Classes level={level} setLevel={setLevel} onNavigate={setPage} />}
      {page === 'Diet Plan' && <Diet />}
      {page === 'Features' && <Features onNavigate={setPage} />}
      {page === 'Workouts' && <Workouts level={level} setLevel={setLevel} completed={completed} setCompleted={setCompleted} />}
      {page === 'Calendar' && <CalendarPage level={level} completed={completed} setCompleted={setCompleted} />}
      {page === 'Dashboard' && <Dashboard level={level} completed={completed} setCompleted={setCompleted} />}
      </ErrorBoundary>
      {page !== 'Home' && <div className="page" style={{ paddingTop: 0 }}><Quote compact /></div>}
      <footer className="footer">IRON/PATH · Train hard, recover harder.</footer>
      <TabBar page={page} onNavigate={setPage} />
    </>
  );
}
