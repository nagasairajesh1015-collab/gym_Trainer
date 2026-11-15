import { Play, CalendarDays, Flame, Target, Search, Moon, Timer, Gauge } from 'lucide-react';
import Quote from '../components/Quote.jsx';
import UpcomingDiet from '../components/UpcomingDiet.jsx';

const FEATURES = [
  [Play, 'Exercise demos', 'Tap any exercise to see its own movement animation, target muscle, how-to and common mistakes.'],
  [CalendarDays, 'Weekly calendar', 'Real dates, week-by-week navigation and green ticks on every completed workout.'],
  [Flame, 'Progress tracking', 'Streaks, weekly completion and an 8-week chart show exactly how consistent you are.'],
  [Target, 'Three levels', 'Beginner, Intermediate and Expert programs with sets, reps and rest scaled to each level.'],
  [Search, 'Search and filters', 'Find any exercise by name or muscle group in seconds.'],
  [Timer, 'Cardio sessions', 'Steady-state and interval cardio on treadmill, bike, rower, rope and more, scaled to your level.'],
  [Gauge, 'Daily motivation', 'Gym quotes on every page and after each finished workout keep your head in the game.'],
  [Moon, 'Built-in recovery', 'One clearly marked rest day each week with simple recovery guidance.'],
];

export default function Features({ onNavigate }) {
  return (
    <main className="page fade-in">
      <p className="eyebrow">Features</p>
      <h1 className="h1s">Everything you need to <em>train smart.</em></h1>
      <div className="grid3" style={{ marginTop: '2rem' }}>
        {FEATURES.map(([Icon, t, d]) => (
          <div key={t} className="card feat"><Icon size={26} /><h3>{t}</h3><p className="muted">{d}</p></div>
        ))}
      </div>
      <h2 className="title"><em>Nutrition</em></h2>
      <UpcomingDiet onMore={() => { onNavigate('Diet Plan'); window.scrollTo({ top: 0 }); }} />
      <Quote />
      <div className="cta-band">
        <h2>Let’s <em>go.</em></h2>
        <button className="btn primary" onClick={() => { onNavigate('Workouts'); window.scrollTo({ top: 0 }); }}>Start Workout</button>
      </div>
    </main>
  );
}
