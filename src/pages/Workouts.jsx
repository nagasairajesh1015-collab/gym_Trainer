import { useState, useMemo } from 'react';
import { Search, X, Check, Undo2 } from 'lucide-react';
import { LEVELS } from '../data/levels.js';
import { getDay, allExercises, TIPS, CARDIO_TIP, chipOf } from '../data/exercises.js';
import { QUOTES } from '../data/quotes.js';
import { toKey } from '../utils/dates.js';
import { WARMUP_GENERAL, DYNAMIC, STRETCH, RAMP, PROGRESSION, musclesOf } from '../data/session.js';
import ExerciseDetail from '../components/ExerciseDetail.jsx';

function Block({ title, items }) {
  return (
    <details className="card block">
      <summary>{title}</summary>
      <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>
    </details>
  );
}

const MUSCLES = ['All', 'Biceps', 'Triceps', 'Chest', 'Back', 'Shoulders', 'Legs', 'Abs', 'Cardio'];

export default function Workouts({ level, setLevel, completed, setCompleted }) {
  const todayIdx = (new Date().getDay() + 6) % 7;
  const tk = toKey(new Date());
  const [day, setDay] = useState(todayIdx === 6 ? 'cardio' : todayIdx);
  const [q, setQ] = useState('');
  const [muscle, setMuscle] = useState('All');
  const [sel, setSel] = useState(null);
  const [toast, setToast] = useState(null);
  const lv = LEVELS.find((l) => l.id === level);
  const searching = q.trim() !== '' || muscle !== 'All';
  const isDone = Boolean(completed[tk]);
  const muscles = day === 'cardio' ? [] : musclesOf(lv.split[day]);
  const warm = [...WARMUP_GENERAL, ...muscles.map((m) => DYNAMIC[m]), ...(muscles.length ? [RAMP] : [])];
  const cool = muscles.length ? ['3 min easy walk and slow nasal breathing', ...muscles.map((m) => STRETCH[m]), 'Hold each stretch 20–30 s, no bouncing'] : ['3–5 min easy walk to bring your heart rate down', 'Calf, quad and hip-flexor stretch, 30 s each'];

  const list = useMemo(() => {
    if (!searching) return getDay(level, day).exercises.map((e) => ({ ...e, day }));
    return allExercises(level).filter(
      (e) => (muscle === 'All' || e.muscle === muscle) && e.name.toLowerCase().includes(q.trim().toLowerCase())
    );
  }, [level, day, q, muscle, searching]);

  const toggleDone = () => {
    const c = { ...completed };
    if (isDone) { delete c[tk]; setToast(null); }
    else {
      c[tk] = { level, day };
      const r = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      setToast(`Workout logged. “${r.q}”`);
      setTimeout(() => setToast(null), 6000);
    }
    setCompleted(c);
  };

  return (
    <main className="page fade-in">
      <h2 className="title"><span>The training floor</span></h2>
      <div className="tabs">
        {LEVELS.map((l) => (
          <button key={l.id} className={level === l.id ? 'tab active' : 'tab'} onClick={() => { setLevel(l.id); setSel(null); }}>{l.name}</button>
        ))}
      </div>
      <p className="muted" style={{ margin: '.5rem 0 1rem' }}>{day === 'cardio' && !searching ? CARDIO_TIP : TIPS[level]}</p>
      <div className="card workbar">
        <div>
          <p className="eyebrow">{isDone ? 'Logged for today' : 'Finished your session?'}</p>
          <h3>{day === 'cardio' ? 'Cardio session' : `Day ${day + 1} · ${lv.split[day]}`}</h3>
          {todayIdx === 6 && <small className="muted">Sunday is a recovery day. Easy cardio is a great fit.</small>}
        </div>
        {isDone
          ? <button className="btn outline" onClick={toggleDone}><Undo2 size={16} /> Undo completion</button>
          : <button className="btn primary" onClick={toggleDone}><Check size={16} /> Mark workout complete</button>}
      </div>
      {toast && <div className="toast fade-in" role="status">{toast}</div>}
      <div className="search">
        <Search size={18} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search exercises…" aria-label="Search exercises" />
        {q && <button onClick={() => setQ('')} aria-label="Clear search"><X size={16} /></button>}
      </div>
      <div className="tabs" style={{ marginTop: '.75rem' }}>
        {MUSCLES.map((m) => (
          <button key={m} className={muscle === m ? 'tab active' : 'tab'} onClick={() => setMuscle(m)}>{m}</button>
        ))}
      </div>
      {!searching && (
        <div className="tabs">
          {lv.split.map((n, i) => (
            <button key={n} className={day === i ? 'tab active' : 'tab'} onClick={() => { setDay(i); setSel(null); }}>
              Day {i + 1} · {n}{i === todayIdx ? ' ★' : ''}
            </button>
          ))}
          <button className={day === 'cardio' ? 'tab active' : 'tab'} onClick={() => { setDay('cardio'); setSel(null); }}>Cardio{todayIdx === 6 ? ' ★' : ''}</button>
        </div>
      )}
      <div className="split">
        <div>
          {!searching && <Block title="Warm-up · 6–8 min" items={warm} />}
          {list.length === 0 && <p className="muted">No exercises match in this program.</p>}
          {list.map((e) => (
            <button key={e.id} className={sel && sel.id === e.id ? 'card ex selected' : 'card ex'} onClick={() => setSel(e)}>
              <div>
                <strong>{e.name}</strong>
                <small>{e.muscle}{searching ? (e.day === 'cardio' ? ' · Cardio' : ` · Day ${e.day + 1}`) : ''}</small>
              </div>
              <span className="chip">{chipOf(e)}</span>
            </button>
          ))}
          {!searching && <Block title="Cool-down · 4–5 min" items={cool} />}
          {!searching && <Block title="How to progress" items={[PROGRESSION[level]]} />}
        </div>
        <aside className="detail">
          {sel
            ? <ExerciseDetail key={sel.id} ex={sel} onClear={() => setSel(null)} />
            : <div className="card empty">Select an exercise to see its demonstration.</div>}
        </aside>
      </div>
    </main>
  );
}
