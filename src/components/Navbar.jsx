import { useState } from 'react';
import { Menu, X } from 'lucide-react';
const LINKS = ['Home', 'Classes', 'Features', 'Workouts', 'Diet Plan', 'Calendar', 'Dashboard'];
export default function Navbar({ page, onNavigate }) {
  const [open, setOpen] = useState(false);
  const go = (p) => { onNavigate(p); setOpen(false); window.scrollTo({ top: 0 }); };
  return (
    <header className="nav">
      <button className="brand" onClick={() => go('Home')}>
        <svg width="24" height="14" viewBox="0 0 22 14" aria-hidden="true"><path d="M1 8c3-6 5-6 8 0s5 6 8 0 3-3 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        IronPath
      </button>
      <nav className={open ? 'links open' : 'links'}>
        {LINKS.map((l) => (
          <button key={l} className={page === l ? 'link active' : 'link'} onClick={() => go(l)}>{l}</button>
        ))}
      </nav>
      <button className="btn primary cta" onClick={() => go('Workouts')}>Start training</button>
      <button className="menu-btn" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </header>
  );
}
