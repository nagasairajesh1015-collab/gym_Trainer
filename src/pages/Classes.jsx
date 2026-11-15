import LevelSelector from '../components/LevelSelector.jsx';
import { LEVELS } from '../data/levels.js';
import { getDay } from '../data/exercises.js';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Classes({ level, setLevel, onNavigate }) {
  const lv = LEVELS.find((l) => l.id === level);
  return (
    <main className="page fade-in">
      <p className="eyebrow">Classes</p>
      <h1 className="h1s">Six days. <em>One plan.</em></h1>
      <p className="sub">Pick a level, then follow the weekly timetable. Every session is 5–7 exercises with sets, reps and rest times.</p>
      <LevelSelector value={level} onChange={setLevel} />
      <h2 className="title">{lv.name} <em>timetable</em></h2>
      {DAYS.map((d, i) => {
        const day = getDay(level, i);
        return (
          <div key={d} className="card row">
            <span className="dayn">{d.slice(0, 3)}</span>
            <div><strong>{day.name}</strong><small className="muted">{day.exercises.length} exercises · {day.exercises.slice(0, 3).map((e) => e.name).join(', ')}…</small></div>
            <button className="btn outline" onClick={() => { onNavigate('Workouts'); window.scrollTo({ top: 0 }); }}>Train</button>
          </div>
        );
      })}
      <div className="card row rest-row">
        <span className="dayn">Sun</span>
        <div><strong>Rest day</strong><small className="muted">Recovery walk, mobility and 7–9 hours of sleep.</small></div>
      </div>
    </main>
  );
}
