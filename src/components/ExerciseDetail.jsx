import { useState, useRef, useEffect } from 'react';
import { X, Timer, Target, Gauge, AlertTriangle } from 'lucide-react';
import ExerciseFigure, { hasMotion, equipOf } from './ExerciseFigure.jsx';
import { DIFF } from '../data/exercises.js';
import { VIDEOS } from '../data/videos.js';

export default function ExerciseDetail({ ex, onClear }) {
  const src = VIDEOS[ex.id];
  const [state, setState] = useState(src ? 'loading' : 'ready'); // loading | ready | failed
  const [speed, setSpeed] = useState(1);
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.playbackRate = speed; }, [speed, state]);
  useEffect(() => { if (state !== 'loading') return undefined; const t = setTimeout(() => setState('failed'), 5000); return () => clearTimeout(t); }, [state]);
  const useVideo = src && state !== 'failed';
  return (
    <div className="card fade-in">
      <div className="media">
        {useVideo ? (
          <>
            {state === 'loading' && <p>Loading video…</p>}
            <video ref={ref} src={src} autoPlay loop muted playsInline controls
              style={{ display: state === 'loading' ? 'none' : 'block' }}
              onCanPlay={() => setState('ready')} onError={() => setState('failed')} />
          </>
        ) : hasMotion(ex.id) ? (
          <ExerciseFigure id={ex.id} />
        ) : (
          <p>Demonstration unavailable for this exercise.</p>
        )}
      </div>
      {useVideo && state === 'ready' && (
        <div className="tabs" style={{ justifyContent: 'center', marginTop: '.6rem' }}>
          <button className={speed === 1 ? 'tab active' : 'tab'} onClick={() => setSpeed(1)}>Normal speed</button>
          <button className={speed === 0.5 ? 'tab active' : 'tab'} onClick={() => setSpeed(0.5)}>Slow motion</button>
        </div>
      )}
      <p className="muted caption">{ex.name} · {useVideo ? 'Animation video' : `${equipOf(ex.id)} animation`}</p>
      <h3>{ex.name}</h3>
      <div className="facts">
        <div className="fact"><Target size={14} /> {ex.muscle}</div>
        <div className="fact"><Gauge size={14} /> {DIFF[ex.diff]}</div>
        {ex.kind === 'k' && <div className="fact"><Timer size={14} /> <strong>{ex.reps}</strong> duration</div>}
        {ex.kind === 'h' && <div className="fact"><Timer size={14} /> <strong>{ex.sets} rounds</strong> · {ex.reps}</div>}
        {ex.kind !== 'k' && ex.kind !== 'h' && <div className="fact"><strong>{ex.sets} × {ex.reps}</strong> sets × reps</div>}
        {ex.inten ? <div className="fact">{ex.inten}</div> : <div className="fact"><Timer size={14} /> Rest {ex.rest}s</div>}
      </div>
      {ex.tempo && <p className="muted" style={{ marginBottom: '.6rem' }}><strong>Pacing:</strong> tempo {ex.tempo} (seconds lowering – pause – lifting – top), stop with {ex.rir} rep{ex.rir === 1 ? '' : 's'} in reserve.</p>}
      <p><strong>How to:</strong> {ex.how}</p>
      <p className="warn"><AlertTriangle size={14} /> <strong>Common mistake:</strong> {ex.mistake}</p>
      <button className="btn outline" onClick={onClear}><X size={16} /> Clear Selection</button>
    </div>
  );
}
