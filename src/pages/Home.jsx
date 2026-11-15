import { Play, CalendarDays, Flame, CheckCircle2, Target, Timer } from 'lucide-react';
import LevelSelector from '../components/LevelSelector.jsx';
import StatCard from '../components/StatCard.jsx';
import Quote from '../components/Quote.jsx';
import UpcomingDiet from '../components/UpcomingDiet.jsx';
import { getDay, EXERCISES } from '../data/exercises.js';
import { weekDates, toKey, fmt } from '../utils/dates.js';
import { streak } from '../utils/streak.js';

const STRIP = [
  [Play, 'An animated demo', 'for every exercise'],
  [Target, 'Three levels', 'beginner to expert'],
  [Timer, 'Strength and cardio', 'in one weekly plan'],
  [CalendarDays, 'Calendar tracking', 'with streaks'],
  [Flame, 'BMI and diet targets', 'built in'],
];

export default function Home({ level, setLevel, completed, onNavigate }) {
  const week = weekDates();
  const tk = toKey(new Date());
  const dow = (new Date().getDay() + 6) % 7;
  const weekDone = week.filter((d) => completed[toKey(d)]).length;
  const pct = Math.round((weekDone / 6) * 100);
  const plan = dow === 6 ? null : getDay(level, dow);
  const go = (p) => { onNavigate(p); window.scrollTo({ top: 0 }); };
  const rows = [[dow, 'Today'], [(dow + 1) % 7, 'Tomorrow']].map(([i, when]) => ({ i, when, p: i === 6 ? null : getDay(level, i) }));
  return (
    <main className="fade-in">
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-main">
          <div>
            <h1>Strength that feels<br />like a habit.</h1>
            <p className="hero-sub">Six-day programs for every level, an animated demo for every exercise, and a calendar that keeps you honest.</p>
            <div className="actions">
              <button className="btn primary" onClick={() => go('Workouts')}>Start workout ↗</button>
              <button className="textlink" onClick={() => document.getElementById('programs').scrollIntoView({ behavior: 'smooth' })}>See the programs ↗</button>
            </div>
          </div>
          <aside className="glass hero-card">
            <p className="g-head"><span className="cdot" /> Your week · {weekDone}/6 done</p>
            {rows.map(({ i, when, p }) => (
              <button key={when} className="g-row" onClick={() => go('Workouts')}>
                <div className="g-top"><strong>{p ? p.name : 'Rest day'}</strong><small>{p ? `${p.exercises.length} exercises` : 'Recovery'}</small></div>
                <div className="g-bot">
                  <div><small>Session</small><b>{p ? `Day ${i + 1}` : 'Sunday'}</b></div>
                  <span className="g-pill">{p ? level : 'Rest'}</span>
                  <div className="r"><small>When</small><b>{when}</b></div>
                </div>
              </button>
            ))}
            <span className="g-tag">Streak {streak(completed)} {streak(completed) === 1 ? 'day' : 'days'}</span>
          </aside>
        </div>
        <div className="hero-strip">
          {STRIP.map(([Icon, a, b], i) => (
            <div key={a} className={i === 0 ? 'hs on' : 'hs'}><Icon size={16} /><span>{a}<br />{b}</span></div>
          ))}
        </div>
      </section>

      <section className="band cream">
        <div className="page flush">
          <div className="strip">
            {[['3', 'Programs'], [Object.keys(EXERCISES).length, 'Exercises'], ['6', 'Training days'], ['1', 'Rest day']].map(([n, l]) => (
              <div key={l}><strong>{n}</strong><span>{l}</span></div>
            ))}
          </div>
          <h2 className="title" id="programs">Choose your <em>program</em></h2>
          <LevelSelector value={level} onChange={setLevel} />
        </div>
      </section>

      <section className="band">
        <div className="page flush">
          <h2 className="title">Your <em>week</em></h2>
          <div className="weekmini">
            {week.map((d, i) => (
              <div key={i} className={`wm ${toKey(d) === tk ? 'today' : ''} ${i === 6 ? 'rest' : ''}`}>
                <small>{fmt(d, { weekday: 'short' })}</small>
                <span className={completed[toKey(d)] ? 'tick' : 'dot'}>{completed[toKey(d)] ? '✓' : i === 6 ? 'R' : d.getDate()}</span>
              </div>
            ))}
          </div>
          <div className="progress"><div className="bar" style={{ width: `${pct}%` }} /></div>
          <p className="muted" style={{ marginTop: '.4rem' }}>{weekDone} of 6 workouts done · {pct}% of the week</p>
          <div className="grid4">
            <StatCard icon={CheckCircle2} label="Total workouts" value={Object.keys(completed).length} />
            <StatCard icon={CalendarDays} label="This week" value={`${weekDone}/6`} />
            <StatCard icon={Flame} label="Streak" value={streak(completed)} />
            <StatCard icon={Target} label="Program" value={level} />
          </div>
          <div className="card today-card">
            <div>
              <p className="eyebrow">Today’s session</p>
              <h3>{plan ? `Day ${dow + 1} · ${plan.name}` : 'Rest day'}</h3>
              <p className="muted">{plan ? `${plan.exercises.length} exercises${completed[tk] ? ' · completed ✓' : ''}` : 'Walk, stretch, hydrate and sleep well.'}</p>
            </div>
            <button className="btn primary" onClick={() => go('Workouts')}>{plan ? 'Go to workout' : 'Browse workouts'}</button>
          </div>
          <h2 className="title"><em>Nutrition</em></h2>
          <UpcomingDiet compact onMore={() => go('Diet Plan')} />
        </div>
      </section>

      <section className="band cream">
        <div className="page flush"><Quote /></div>
      </section>

      <section className="band">
        <div className="page flush">
          <div className="cta-band">
            <h2>Ready to <em>start?</em></h2>
            <button className="btn primary" onClick={() => go('Workouts')}>Start workout ↗</button>
          </div>
        </div>
      </section>
    </main>
  );
}
