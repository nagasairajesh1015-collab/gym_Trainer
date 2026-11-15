import { LEVELS } from '../data/levels.js';
export default function LevelSelector({ value, onChange }) {
  return (
    <div className="grid3">
      {LEVELS.map((l) => (
        <button key={l.id} className={value === l.id ? 'card level selected' : 'card level'} onClick={() => onChange(l.id)}>
          <h3>{l.name}</h3>
          <p>{l.tagline}</p>
          <small>6 days a week · {l.intensity}</small>
          <div className="chips">{l.split.map((s) => <span key={s} className="chip">{s}</span>)}</div>
        </button>
      ))}
    </div>
  );
}
