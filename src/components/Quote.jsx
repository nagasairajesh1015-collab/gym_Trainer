import { useState, useEffect } from 'react';
import { QUOTES } from '../data/quotes.js';

const dayOfYear = () => Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);

export default function Quote({ compact = false }) {
  const [i, setI] = useState(dayOfYear() % QUOTES.length);
  useEffect(() => {
    const timer = setInterval(() => setI((x) => (x + 1) % QUOTES.length), 12000);
    return () => clearInterval(timer);
  }, []);
  const { q, by } = QUOTES[i];
  return (
    <figure className={compact ? 'quote compact' : 'quote'}>
      <blockquote key={i} className="fade-in">“{q}”</blockquote>
      <figcaption>— {by}</figcaption>
    </figure>
  );
}
