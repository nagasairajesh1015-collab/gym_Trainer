import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { getAI } from '../services/ai.js';
import { ACTIVITY, cuts, toMetric, bmi, classify, idealRange, devine, gate, plan } from '../utils/nutrition.js';

const BLANK = { sex: 'female', age: '', weight: '', wu: 'kg', height: '', hu: 'cm', activity: '1.55', scheme: 'who', goal: 'loss', deficit: '0.2' };
const FLAGS = [['preg', 'I’m pregnant or breastfeeding'], ['ed', 'I have or had an eating disorder'], ['med', 'I have diabetes, kidney disease or another medical condition']];
const f1 = (n) => (Math.round(n * 10) / 10).toFixed(1);
const LB = 0.45359237;

export default function Diet() {
  const [p, setP] = useLocalStorage('gt:profile', BLANK);
  const [flags, setFlags] = useState({ preg: false, ed: false, med: false });
  const [ai, setAi] = useState({ status: 'idle' });
  const reset = () => { setP(BLANK); setFlags({ preg: false, ed: false, med: false }); setAi({ status: 'idle' }); };
  const set = (k, v) => setP({ ...p, [k]: v });
  const age = parseFloat(p.age), w = parseFloat(p.weight), h = parseFloat(p.height);
  const filled = age > 0 && w > 0 && h > 0;
  const { kg, cm } = toMetric({ weight: w, weightUnit: p.wu, height: h, heightUnit: p.hu });
  const errors = [];
  if (filled && age > 80) errors.push('Plans are available for ages 18–80.');
  if (filled && (kg < 30 || kg > 300)) errors.push('Weight should be between 30 and 300 kg.');
  if (filled && (cm < 120 || cm > 230)) errors.push('Height should be between 120 and 230 cm.');
  const underage = filled && age < 18;
  const ok = filled && !underage && errors.length === 0;

  let r = null;
  if (ok) {
    const b = bmi(kg, cm), c = cuts(p.scheme);
    const reasons = gate({ b, flags });
    r = {
      b, c, cat: classify(b, p.scheme), range: idealRange(cm, age, p.scheme), ref: devine(cm, p.sex), reasons,
      pl: p.goal === 'loss' && reasons.length === 0 ? plan({ kg, cm, age, sex: p.sex, activity: parseFloat(p.activity), deficit: parseFloat(p.deficit) }) : null,
    };
  }
  const key = ok ? JSON.stringify([p.sex, age, f1(kg), f1(cm), p.activity, p.scheme, p.goal, p.deficit]) : '';
  const aiNow = ai.status === 'done' && ai.key !== key ? { status: 'idle' } : ai;
  const canAI = Boolean(r) && r.reasons.length === 0;
  const analyze = async () => {
    setAi({ status: 'loading' });
    try {
      const client = await getAI();
      if (!client) { setAi({ status: 'unavailable' }); return; }
      const loss = p.goal === 'loss';
      const high = p.scheme === 'asian' ? 22.9 : 24.9;
      const prompt = `You are a careful nutrition calculator and coach. Recompute everything yourself from the inputs and formulas below, then add coaching text. Reply with JSON only (no markdown).

INPUTS: sex=${p.sex}; age=${age}; weight_kg=${f1(kg)}; height_cm=${f1(cm)}; activity_factor=${p.activity}; bmi_standard=${p.scheme}; goal=${loss ? 'weight loss' : 'check BMI only'}${loss ? `; deficit=${p.deficit}` : ''}

FORMULAS:
- BMI = kg / (m^2), rounded to 1 decimal. Category: under 18.5 Underweight; ${p.scheme === 'asian' ? 'under 23 Normal; under 27.5 Overweight; else Obese' : 'under 25 Normal; under 30 Overweight; else Obese'}.
- Ideal weight range (kg) = 18.5 x m^2 to ${age >= 65 ? '27' : high} x m^2${age >= 65 ? ' (adults 65+ use BMI 22 to 27, so low uses 22)' : ''}, 1 decimal.
${loss ? `- BMR (Mifflin-St Jeor) = 10*kg + 6.25*cm - 5*age + (5 if male, -161 if female).
- TDEE = BMR x activity_factor.
- kcal = TDEE x (1 - deficit), rounded to nearest 50, minimum ${p.sex === 'male' ? 1500 : 1200}.
- protein_g = 1.8 x kg (if BMI >= 30 use weight at BMI 25 instead); if carbs would be under 100 g use 1.6 instead. Round to whole grams.
- fat_g = max(25% of kcal, 0.6 x kg x 9) / 9, whole grams.
- carbs_g = (kcal - 4*protein_g - 9*fat_g) / 4, whole grams.
- fiber_g = max(14 x kcal/1000, ${p.sex === 'male' ? 30 : 25}), capped at 40, whole grams.` : ''}

RETURN THIS JSON: {"bmi":number,"category":string,"idealLowKg":number,"idealHighKg":number${loss ? ',"bmr":integer,"tdee":integer,"kcal":integer,"protein":integer,"carbs":integer,"fat":integer,"fiber":integer' : ''},"summary":"2-3 plain sentences about where they stand","tips":["3 to 4 short practical tips"],"meals":[{"meal":"Breakfast","idea":"..."},{"meal":"Lunch","idea":"..."},{"meal":"Snack","idea":"..."},{"meal":"Dinner","idea":"..."}],"cautions":["0 to 2 short cautions"]}
Meal ideas should be simple, include a vegetarian-friendly option, and roughly fit the protein and fiber targets. Be kind, no shaming, never suggest fasting or crash diets, and do not change the calorie target.`;
      const data = await client.json(prompt);
      setAi({ status: 'done', data, key });
    } catch (e) { setAi({ status: e && e.code === 'not_granted' ? 'declined' : 'error' }); }
  };
  const d = aiNow.status === 'done' ? aiNow.data : null;
  const checks = [];
  if (d && r) {
    const add = (label, mine, theirs, tol, unit = '') => { const t = Number(theirs); if (theirs !== undefined && theirs !== null && !Number.isNaN(t)) checks.push({ label, mine, theirs: t, unit, ok: Math.abs(t - mine) <= tol }); };
    add('BMI', +f1(r.b), d.bmi, 0.15);
    add('Healthy range low', +f1(r.range[0]), d.idealLowKg, 0.3, ' kg');
    add('Healthy range high', +f1(r.range[1]), d.idealHighKg, 0.3, ' kg');
    if (r.pl) {
      add('Resting calories', r.pl.bmr, d.bmr, 5); add('Maintenance calories', r.pl.tdee, d.tdee, 10); add('Daily calories', r.pl.kcal, d.kcal, 50, ' kcal');
      add('Protein', r.pl.protein, d.protein, 3, ' g'); add('Carbohydrates', r.pl.carbs, d.carbs, 6, ' g'); add('Fat', r.pl.fat, d.fat, 3, ' g'); add('Fiber', r.pl.fiber, d.fiber, 2, ' g');
    }
  }
  const allOk = checks.length > 0 && checks.every((c) => c.ok);
  const vt = (labels) => checks.length > 0 && checks.filter((c) => labels.includes(c.label)).every((c) => c.ok) && checks.some((c) => labels.includes(c.label));
  const aiMsg = { unavailable: 'AI review works when this page is opened in Claude, or on your own site once an AI service is connected. Your calculated numbers above are still correct.', declined: 'AI access was declined. Your calculated numbers above are still correct.', error: 'Couldn’t reach the AI just now. Your calculated numbers above are still correct.' }[aiNow.status];
  const Tabs = ({ k, opts }) => (
    <div className="tabs">{opts.map(([v, l]) => <button key={v} className={p[k] === v ? 'tab active' : 'tab'} onClick={() => set(k, v)}>{l}</button>)}</div>
  );

  return (
    <main className="page fade-in">
      <p className="eyebrow">Diet plan</p>
      <h1 className="h1s">Know your <em>numbers.</em></h1>
      <p className="sub">Enter your details to see your BMI, a healthy weight range and, for weight loss, daily calorie, macro and fiber targets.</p>
      <div className="card">
        <div className="card-head"><h3>Your details</h3><button className="btn outline small" onClick={reset}>Reset</button></div>
        <div className="form">
          <div className="field"><label>Sex</label><Tabs k="sex" opts={[['female', 'Female'], ['male', 'Male']]} /></div>
          <div className="field"><label htmlFor="age">Age (years)</label><input id="age" type="number" inputMode="numeric" value={p.age} onChange={(e) => set('age', e.target.value)} placeholder="e.g. 32" /></div>
          <div className="field"><label htmlFor="wt">Weight</label>
            <div className="inline"><input id="wt" type="number" inputMode="decimal" value={p.weight} onChange={(e) => set('weight', e.target.value)} placeholder="e.g. 70" />
              <select value={p.wu} onChange={(e) => set('wu', e.target.value)}><option value="kg">kg</option><option value="lb">lb</option></select></div></div>
          <div className="field"><label htmlFor="ht">Height</label>
            <div className="inline"><input id="ht" type="number" inputMode="decimal" value={p.height} onChange={(e) => set('height', e.target.value)} placeholder="e.g. 165" />
              <select value={p.hu} onChange={(e) => set('hu', e.target.value)}><option value="cm">cm</option><option value="in">in</option></select></div></div>
          <div className="field"><label htmlFor="act">Activity level</label>
            <select id="act" value={p.activity} onChange={(e) => set('activity', e.target.value)}>{ACTIVITY.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
          <div className="field"><label>BMI standard</label><Tabs k="scheme" opts={[['who', 'WHO'], ['asian', 'Asian']]} /></div>
          <div className="field"><label>Goal</label><Tabs k="goal" opts={[['loss', 'Weight loss'], ['check', 'Just check BMI']]} /></div>
          {p.goal === 'loss' && <div className="field"><label>Calorie deficit</label><Tabs k="deficit" opts={[['0.15', '15% gentle'], ['0.2', '20% steady'], ['0.25', '25% faster']]} /></div>}
        </div>
        <div className="checks">
          {FLAGS.map(([k, l]) => <label key={k} className="check"><input type="checkbox" checked={flags[k]} onChange={(e) => setFlags({ ...flags, [k]: e.target.checked })} /> {l}</label>)}
        </div>
        <p className="muted" style={{ fontSize: '.8rem', marginTop: '.8rem' }}>Your measurements stay on this device. The checkboxes are never saved.</p>
      </div>

      {errors.map((e) => <div key={e} className="banner" style={{ marginTop: '1rem', borderRadius: 12 }}>{e}</div>)}
      {underage && <div className="card" style={{ marginTop: '1rem' }}><h3>Under 18</h3><p className="muted">BMI for young people needs growth charts and a doctor’s guidance, so we don’t calculate it here. Please talk to a doctor or paediatrician.</p></div>}

      {r && (
        <div className="fade-in">
          <h2 className="title">Your <em>BMI</em></h2>
          <div className="card">
            <div className="bmi-head"><strong className="big">{f1(r.b)}</strong><span className="badge" style={{ margin: 0 }}>{r.cat}</span>{vt(['BMI']) && <span className="vtag">✓ AI-verified</span>}</div>
            <div className="scale" style={{ background: `linear-gradient(90deg,#60a5fa 0 14%,#22c55e 14% ${((r.c.over - 15) / 25) * 100}%,#f59e0b ${((r.c.over - 15) / 25) * 100}% ${((r.c.obese - 15) / 25) * 100}%,#ef4444 ${((r.c.obese - 15) / 25) * 100}%)` }}>
              <i className="marker" style={{ left: `${Math.min(100, Math.max(0, ((r.b - 15) / 25) * 100))}%` }} />
            </div>
            <div className="scale-l"><span>15</span><span>18.5</span><span>{r.c.over}</span><span>{r.c.obese}</span><span>40</span></div>
            <p className="muted">BMI = weight (kg) ÷ height (m)². It is a screening tool: it can overstate risk for very muscular people.</p>
          </div>

          <h2 className="title">Healthy <em>weight range</em></h2>
          <div className="card">
            <strong className="big">{f1(r.range[0])}–{f1(r.range[1])} kg{vt(['Healthy range low', 'Healthy range high']) && <span className="vtag">✓ AI-verified</span>}</strong>
            <p className="muted">{f1(r.range[0] / LB)}–{f1(r.range[1] / LB)} lb · reference point (Devine) {f1(r.ref)} kg</p>
            <p style={{ marginTop: '.6rem' }}>{kg > r.range[1] ? `You are ${f1(kg - r.range[1])} kg above the top of your range.` : kg < r.range[0] ? `You are ${f1(r.range[0] - kg)} kg below the bottom of your range.` : 'You are inside your healthy range.'}</p>
            {age >= 65 && <p className="muted">For adults 65 and over we use BMI 22–27.</p>}
          </div>

          {p.goal === 'loss' && r.reasons.length > 0 && (
            <div className="card" style={{ marginTop: '1rem', borderColor: '#f59e0b' }}>
              <h3>Please see a professional first</h3>
              {r.reasons.map((t) => <p key={t} className="muted" style={{ marginTop: '.4rem' }}>{t}</p>)}
            </div>
          )}

          {r.pl && (
            <>
              <h2 className="title">Daily <em>targets</em></h2>
              <div className="card">
                <strong className="big">{r.pl.kcal} kcal{vt(['Daily calories', 'Protein', 'Carbohydrates', 'Fat', 'Fiber']) && <span className="vtag">✓ AI-verified</span>}</strong>
                <p className="muted">Resting {r.pl.bmr} · maintenance {r.pl.tdee} · deficit {r.pl.deficitKcal} kcal/day · about {r.pl.weeklyLossKg} kg per week</p>
                {r.pl.floored && <p className="warn">Calories were raised to the safe minimum, so loss will be slower.</p>}
                <div className="macro-bar">
                  <i style={{ width: `${r.pl.pct.p}%`, background: 'var(--accent)' }} /><i style={{ width: `${r.pl.pct.c}%`, background: '#22c55e' }} /><i style={{ width: `${r.pl.pct.f}%`, background: '#f59e0b' }} />
                </div>
                <ul className="plan">
                  <li><span><b className="dotc" style={{ background: 'var(--accent)' }} />Protein</span><span>{r.pl.protein} g · {r.pl.pct.p}%</span></li>
                  <li><span><b className="dotc" style={{ background: '#22c55e' }} />Carbohydrates</span><span>{r.pl.carbs} g · {r.pl.pct.c}%</span></li>
                  <li><span><b className="dotc" style={{ background: '#f59e0b' }} />Fat</span><span>{r.pl.fat} g · {r.pl.pct.f}%</span></li>
                  <li><span>Fiber (counted within carbs)</span><span>{r.pl.fiber} g</span></li>
                </ul>
                <p className="muted">Protein protects muscle, carbs fuel training, fat supports hormones and fiber keeps you full. Add fiber gradually and drink plenty of water. Recalculate every 4 weeks or when your weight changes by 2 kg.</p>
              </div>
            </>
          )}
          {canAI && (
            <>
              <h2 className="title">AI <em>coach review</em></h2>
              <div className="card">
                {!d && (
                  <>
                    <p className="muted">The AI double-checks your BMI, calories and macros with its own calculation, then adds personal tips and meal ideas. Your numbers above stay the same. Only your age, sex, height, weight and activity level are sent.</p>
                    <button className="btn primary" style={{ marginTop: '1rem' }} disabled={aiNow.status === 'loading'} onClick={analyze}>{aiNow.status === 'loading' ? 'Analyzing…' : 'Analyze with AI'}</button>
                    {aiMsg && <p className="warn">{aiMsg}</p>}
                  </>
                )}
                {d && (
                  <>
                    <div className="bmi-head"><strong className="big" style={{ fontSize: '1.6rem' }}>{allOk ? 'Numbers verified' : 'Small differences found'}</strong><span className="badge" style={{ margin: 0 }}>{allOk ? '✓ match' : 'review'}</span></div>
                    <ul className="plan">
                      {checks.map((c) => (
                        <li key={c.label}><span>{c.label}</span><span>{c.ok ? <b className="ok">✓ {c.mine}{c.unit}</b> : <b className="bad">AI says {c.theirs}{c.unit}, we use {c.mine}{c.unit}</b>}</span></li>
                      ))}
                    </ul>
                    {!allOk && <p className="muted">When the AI differs, the verified formula results above are the ones to follow.</p>}
                    {d.summary && <p style={{ marginTop: '.8rem' }}>{d.summary}</p>}
                    {Array.isArray(d.tips) && d.tips.length > 0 && (<><h3 style={{ marginTop: '1rem' }}>Tips for you</h3><ul className="tips">{d.tips.map((t) => <li key={t}>{t}</li>)}</ul></>)}
                    {Array.isArray(d.meals) && d.meals.length > 0 && (<><h3 style={{ marginTop: '1rem' }}>Meal ideas</h3><ul className="plan">{d.meals.map((m) => <li key={m.meal}><b>{m.meal}</b><span className="muted" style={{ textAlign: 'right' }}>{m.idea}</span></li>)}</ul></>)}
                    {Array.isArray(d.cautions) && d.cautions.map((t) => <p key={t} className="warn">{t}</p>)}
                    <button className="btn outline small" onClick={() => setAi({ status: 'idle' })}>Run again</button>
                  </>
                )}
              </div>
            </>
          )}
          <p className="muted" style={{ marginTop: '1.2rem', textAlign: 'center' }}>These are estimates, not medical advice.</p>
        </div>
      )}
    </main>
  );
}
