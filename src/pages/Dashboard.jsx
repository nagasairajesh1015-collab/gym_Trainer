import { useState } from 'react';
import { CheckCircle2, Flame, CalendarDays, Target, Trash2, Moon } from 'lucide-react';
import StatCard from '../components/StatCard.jsx';
import { LEVELS } from '../data/levels.js';
import { getDay } from '../data/exercises.js';
import { toKey, parseKey, addDays, startOfWeek, weekDates, fmt } from '../utils/dates.js';
import { streak } from '../utils/streak.js';


export default function Dashboard({ level, completed, setCompleted }) {
  const [confirm, setConfirm] = useState(false);
  const today = new Date();
  const dow = (today.getDay() + 6) % 7;
  const plan = dow === 6 ? null : getDay(level, dow);
  const done = weekDates().filter((d) => completed[toKey(d)]).length;
  const pct = Math.round((done / 6) * 100);
  const nextRest = addDays(today, 6 - dow);
  const history = Object.entries(completed).sort((a, b) => b[0].localeCompare(a[0]));
  const series = Array.from({ length: 8 }, (_, i) => {
    const s = addDays(startOfWeek(today), -7 * (7 - i));
    return { label: fmt(s, { day: 'numeric', month: 'short' }), c: weekDates(s).filter((d) => completed[toKey(d)]).length };
  });
  const lv = LEVELS.find((l) => l.id === level);

  return (
    <main className="page fade-in">
      <h2 style={{ marginTop: '.5rem' }}>Dashboard</h2>
      <div className="grid4">
        <StatCard icon={Target} label="Level" value={lv.name} />
        <StatCard icon={CheckCircle2} label="Total completed" value={history.length} />
        <StatCard icon={CalendarDays} label="Weekly completion" value={`${pct}%`} />
        <StatCard icon={Flame} label="Current streak" value={streak(completed)} />
      </div>
      <div className="grid2">
        <div className="card">
          <p className="eyebrow">Today’s workout</p>
          <h3>{plan ? `Day ${dow + 1} · ${plan.name}` : 'Rest day'}</h3>
          <p className="muted">{plan ? `${plan.exercises.length} exercises${completed[toKey(today)] ? ' · completed' : ''}` : 'Walk, stretch and sleep well.'}</p>
        </div>
        <div className="card">
          <p className="eyebrow">Upcoming rest day</p>
          <h3><Moon size={18} /> {dow === 6 ? 'Today' : fmt(nextRest, { weekday: 'long', day: 'numeric', month: 'short' })}</h3>
          <p className="muted">Sunday is your recovery day every week.</p>
        </div>
      </div>
      <h2>Progress · last 8 weeks</h2>
      <div className="card bars">
        {series.map((w) => (
          <div key={w.label} className="barcol">
            <span className="muted">{w.c}</span>
            <div className="track"><div className="fill" style={{ height: `${(w.c / 6) * 100}%` }} /></div>
            <small>{w.label}</small>
          </div>
        ))}
      </div>
      <h2>Workout history</h2>
      {history.length === 0 && <div className="card empty">No workouts completed yet. Finish one from the Calendar.</div>}
      {history.slice(0, 12).map(([k, c]) => (
        <div key={k} className="card hist">
          <span>{fmt(parseKey(k), { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span className="muted">{c.level} · {getDay(c.level, c.day).name}</span>
          <span className="tick" style={{ width: 20, height: 20 }}>✓</span>
        </div>
      ))}
      <button className="btn outline" style={{ marginTop: '1.5rem' }} onClick={() => setConfirm(true)}><Trash2 size={16} /> Reset progress</button>
      {confirm && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="card">
            <h3>Reset all progress?</h3>
            <p className="muted" style={{ margin: '.5rem 0 1rem' }}>This permanently deletes {history.length} completed workout{history.length === 1 ? '' : 's'} and can’t be undone.</p>
            <button className="btn outline" onClick={() => setConfirm(false)}>Cancel</button>{' '}
            <button className="btn primary" onClick={() => { setCompleted({}); setConfirm(false); }}>Yes, reset</button>
          </div>
        </div>
      )}
    </main>
  );
}
