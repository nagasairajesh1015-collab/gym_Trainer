import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check, Undo2 } from 'lucide-react';
import { toKey, parseKey, addDays, weekDates, fmt } from '../utils/dates.js';
import { getDay } from '../data/exercises.js';


export default function CalendarPage({ level, completed, setCompleted }) {
  const today = new Date();
  const tk = toKey(today);
  const [offset, setOffset] = useState(0);
  const [sel, setSel] = useState(tk);
  const days = useMemo(() => weekDates(addDays(new Date(), offset * 7)), [offset]);

  const go = (n) => { setOffset(offset + n); setSel(toKey(addDays(parseKey(sel), 7 * n))); };
  const date = parseKey(sel);
  const dow = (date.getDay() + 6) % 7;
  const rest = dow === 6;
  const plan = rest ? null : getDay(level, dow);
  const isDone = Boolean(completed[sel]);
  const future = sel > tk;
  const toggle = () => {
    const c = { ...completed };
    if (isDone) delete c[sel]; else c[sel] = { level, day: dow };
    setCompleted(c);
  };

  return (
    <main className="page fade-in">
      <div className="cal-head">
        <button className="arrow" onClick={() => go(-1)} aria-label="Previous week"><ChevronLeft /></button>
        <h2 style={{ margin: 0 }}>{fmt(days[0], { day: 'numeric', month: 'short' })} – {fmt(days[6], { day: 'numeric', month: 'short', year: 'numeric' })}</h2>
        <button className="arrow" onClick={() => go(1)} aria-label="Next week"><ChevronRight /></button>
      </div>
      <div className="weekbar">
        {days.map((d, i) => {
          const k = toKey(d);
          const cls = ['date', k === sel && 'sel', k === tk && 'today', i === 6 && 'rest'].filter(Boolean).join(' ');
          return (
            <button key={k} className={cls} onClick={() => setSel(k)}>
              <small>{fmt(d, { weekday: 'short' })}</small>
              <b>{d.getDate()}</b>
              {completed[k] ? <span className="tick"><Check size={14} /></span> : <small>{i === 6 ? 'REST DAY' : getDay(level, i).name.split(' ')[0]}</small>}
            </button>
          );
        })}
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <p className="eyebrow">{fmt(date, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        {rest ? (
          <>
            <h3>REST DAY</h3>
            <p className="muted">Recover: a 20–30 minute easy walk or light cardio, light mobility work, plenty of water, and 7–9 hours of sleep. Muscles grow while you rest.</p>
          </>
        ) : (
          <>
            <h3>Day {dow + 1} · {plan.name}</h3>
            <ul className="plan">
              {plan.exercises.map((e) => <li key={e.id}>{e.name} <span className="muted">{e.sets} × {e.reps}</span></li>)}
            </ul>
            {isDone
              ? <button className="btn outline" onClick={toggle}><Undo2 size={16} /> Undo completion</button>
              : <button className="btn primary" disabled={future} onClick={toggle}><Check size={16} /> Mark workout complete</button>}
            {future && <p className="muted" style={{ marginTop: '.5rem' }}>You can’t complete a workout in the future.</p>}
            {isDone && <p className="muted" style={{ marginTop: '.5rem' }}>Completed on the {completed[sel].level} program.</p>}
          </>
        )}
      </div>
    </main>
  );
}
