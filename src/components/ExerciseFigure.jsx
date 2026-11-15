import { useState, useEffect } from 'react';

const rad = (a) => (a * Math.PI) / 180;
const seg = (p, a, l) => [p[0] + l * Math.sin(rad(a)), p[1] + l * Math.cos(rad(a))]; // 0° = down, +° = forward
const mix = (A, B, s) => A.map((v, i) => v + (B[i] - v) * s);
const pts = (...p) => p.map((q) => q.join(',')).join(' ');

// Standing poses [torso lean, upper-arm angle, elbow bend, thigh angle, knee bend, heel lift]: start → end
const STAND = {
  curl: [[0, 0, 5, 0, 0, 0], [0, 0, 140, 0, 0, 0]],
  icurl: [[-35, -12, 5, 0, 0, 0], [-35, -12, 140, 0, 0, 0]],
  pd: [[0, 10, 100, 0, 0, 0], [0, 10, 5, 0, 0, 0]],
  press: [[0, 90, 90, 0, 0, 0], [0, 175, 5, 0, 0, 0]],
  raise: [[0, 5, 10, 0, 0, 0], [0, 90, 10, 0, 0, 0]],
  rear: [[60, 0, 10, 15, 20, 0], [60, 75, 10, 15, 20, 0]],
  ext: [[0, 180, 110, 0, 0, 0], [0, 180, 0, 0, 0, 0]],
  kick: [[60, -90, 90, 15, 20, 0], [60, -90, 0, 15, 20, 0]],
  squat: [[5, 90, 0, 0, 0, 0], [30, 90, 0, 95, 110, 0]],
  lunge: [[0, 0, 0, 0, 0, 0], [5, 0, 0, 60, 75, 0]],
  hinge: [[0, 0, 0, 0, 5, 0], [75, 0, 0, 30, 25, 0]],
  row: [[60, 10, 5, 20, 25, 0], [60, -70, 70, 20, 25, 0]],
  pull: [[0, 175, 5, 0, 0, 0], [0, 110, 70, 0, 0, 0]],
  push: [[0, -30, 120, 0, 0, 0], [0, 90, 0, 0, 0, 0]],
  calf: [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 12]],
  jump: [[0, 40, 60, 0, 10, 0], [0, 40, 60, 0, 10, 16]],
};
const RUN = {
  run: { amp: 45, kb: 60, arm: 50, lean: 12, sp: 4, off: 0 },
  walk: { amp: 24, kb: 18, arm: 24, lean: 3, sp: 2, off: 0 },
  glide: { amp: 28, kb: 14, arm: 32, lean: 0, sp: 2.5, off: 0 },
  stairs: { amp: 30, kb: 55, arm: 20, lean: 8, sp: 2.5, off: 14 },
  highknee: { amp: 50, kb: 85, arm: 45, lean: 4, sp: 4, off: 38 },
};
// Lying poses [torso lift angle, arm height]
const LYING = { bench: [[0, 20], [0, 70]], crunch: [[0, 10], [38, 10]] };

// One entry per exercise id: [movement, equipment, option]. This is the exercise → animation tag.
export const SPEC = {
  dbcurl: ['curl', 'db'], hammer: ['curl', 'db'], barcurl: ['curl', 'bar'], conc: ['curl', 'db'], cablecurl: ['curl', 'cablelow'], inclcurl: ['icurl', 'db'],
  bwsquat: ['squat', 'bw'], goblet: ['squat', 'db'], backsquat: ['squat', 'back'], legpress: ['legpress', 'machine'], lunge: ['lunge', 'db'], bss: ['lunge', 'db', 'bench'], rdl: ['hinge', 'bar'], calf: ['calf', 'bw'],
  machpress: ['push', 'machine'], dbbench: ['bench', 'db'], inclpress: ['bench', 'db', 'inc'], barbench: ['bench', 'bar'], cablefly: ['push', 'cablehigh'], pecdeck: ['push', 'machine'], cgbench: ['bench', 'bar'],
  pushdown: ['pd', 'cablehigh'], ropepd: ['pd', 'cablehigh'], ohext: ['ext', 'db'], skull: ['skull', 'bar'], kick: ['kick', 'db'],
  dbpress: ['press', 'db'], arnold: ['press', 'db'], ohp: ['press', 'bar'], lat: ['raise', 'db'], front: ['raise', 'db'], rear: ['rear', 'db'], face: ['row', 'cablehigh'],
  crunch: ['crunch', 'bw'], plank: ['plank', 'bw'], legraise: ['legraise', 'bw'], bicycle: ['crunch', 'bw'], russian: ['crunch', 'db'], cablecrunch: ['crunch', 'cablehigh'], hangknee: ['hangknee', 'bw'],
  walk: ['walk', 'machine'], jog: ['run', 'machine'], sprint: ['run', 'machine'], bike: ['bike', 'machine'], elliptical: ['glide', 'machine'], stairs: ['stairs', 'machine'], rower: ['rower', 'machine'], rope: ['jump', 'rope'], hknee: ['highknee', 'bw'], climbers: ['climber', 'bw'],
  pullup: ['pullup', 'bw'], barrow: ['row', 'bar'], cablerow: ['row', 'cablelow'], dbrow: ['row', 'db'], strarm: ['pull', 'cablehigh'],
};
const EQUIP = { rope: 'Jump rope', db: 'Dumbbell', bar: 'Barbell', back: 'Barbell', cablehigh: 'Cable', cablelow: 'Cable', machine: 'Machine', bw: 'Bodyweight' };
export const hasMotion = (id) => Boolean(SPEC[id]);
export const equipOf = (id) => (SPEC[id] ? EQUIP[SPEC[id][1]] : '');

const line = { stroke: '#F4EDE0', strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
const arm = { ...line, stroke: '#FF6B5B' };
const grey = '#6b6e76';

function Gear({ eq, at }) {
  if (eq === 'bar') return <circle cx={at[0]} cy={at[1]} r="12" stroke="#FF6B5B" strokeWidth="4" fill="none" />;
  if (eq === 'db') return <circle cx={at[0]} cy={at[1]} r="7" fill="#FF6B5B" />;
  if (eq === 'machine') return <rect x={at[0] - 7} y={at[1] - 7} width="14" height="14" rx="3" fill="#FF6B5B" />;
  if (eq === 'cablehigh' || eq === 'cablelow') {
    const py = eq === 'cablehigh' ? 8 : 192;
    return (<g><line x1={at[0] + 10} y1={py} x2={at[0]} y2={at[1]} stroke={grey} strokeWidth="2" /><circle cx={at[0] + 10} cy={py} r="4" fill={grey} /><circle cx={at[0]} cy={at[1]} r="6" fill="#FF6B5B" /></g>);
  }
  return null;
}

// two-bone IK: knee position between A and B (dir -1 bends the knee forward/up)
const ik = (A, B, l1, l2, dir = -1) => {
  const dx = B[0] - A[0], dy = B[1] - A[1], dist = Math.hypot(dx, dy) || 1;
  const d = Math.min(dist, l1 + l2 - 0.01), a = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const ux = dx / dist, uy = dy / dist;
  return [A[0] + a * ux - dir * h * uy, A[1] + a * uy + dir * h * ux];
};

function Standing({ m, eq, opt, s }) {
  const [lean, u, b, th, kn, lift] = mix(STAND[m][0], STAND[m][1], s);
  const F = [100, 190 - lift], a2 = th - kn;
  const K = [F[0] - 45 * Math.sin(rad(a2)), F[1] - 45 * Math.cos(rad(a2))];
  const H = [K[0] - 45 * Math.sin(rad(th)), K[1] - 45 * Math.cos(rad(th))];
  const N = seg(H, 180 - lean, 58), E = seg(N, u, 36), D = seg(E, u + b, 34), Hd = seg(N, 180 - lean, 17);
  return (
    <g>
      {eq === 'rope' && <ellipse cx="100" cy="108" rx="46" ry="84" fill="none" stroke="#FF6B5B" strokeWidth="2" strokeDasharray="4 3" />}
      {opt === 'bench' && <rect x="28" y="160" width="40" height="30" rx="4" fill="#2a2c31" />}
      <polyline {...line} points={pts(F, K, H, N)} />
      <polyline {...arm} points={pts(N, E, D)} />
      <circle cx={Hd[0]} cy={Hd[1]} r="10" fill="#F4EDE0" />
      {eq === 'back' ? <circle cx={N[0]} cy={N[1]} r="12" stroke="#FF6B5B" strokeWidth="4" fill="none" /> : <Gear eq={eq} at={D} />}
    </g>
  );
}

function Lying({ m, eq, opt, s }) {
  const [lift, ah] = mix(LYING[m][0], LYING[m][1], s);
  const ang = lift + (opt === 'inc' ? 30 : 0), c = Math.cos(rad(ang)), sn = Math.sin(rad(ang));
  const H = [55, 150], N = [55 + 68 * c, 150 - 68 * sn], Hd = [N[0] + 16 * c, N[1] - 16 * sn], hand = [N[0], N[1] - ah];
  return (
    <g>
      {opt === 'inc' && <line x1="55" y1="160" x2={N[0]} y2={N[1] + 10} stroke="#2a2c31" strokeWidth="10" strokeLinecap="round" />}
      <polyline {...line} points={pts([115, 150], [90, 112], H, N)} />
      <polyline {...arm} points={pts(N, hand)} />
      <circle cx={Hd[0]} cy={Hd[1]} r="10" fill="#F4EDE0" />
      <Gear eq={eq === 'cablehigh' ? 'cablehigh' : eq} at={hand} />
    </g>
  );
}

function Skull({ s }) {
  const N = [123, 150], E = [N[0], N[1] - 45], phi = 100 * s;
  const hand = [E[0] + 40 * Math.sin(rad(phi)), E[1] - 40 * Math.cos(rad(phi))];
  return (
    <g>
      <polyline {...line} points={pts([115, 150], [90, 112], [55, 150], N)} />
      <polyline {...arm} points={pts(N, E, hand)} />
      <circle cx={N[0] + 16} cy={N[1]} r="10" fill="#F4EDE0" />
      <Gear eq="bar" at={hand} />
    </g>
  );
}

function LegRaise({ s }) {
  const th = 5 + 85 * s, Hp = [95, 150];
  const F = [Hp[0] - 85 * Math.cos(rad(th)), Hp[1] - 85 * Math.sin(rad(th))];
  return (
    <g>
      <polyline {...line} points={pts(F, Hp, [155, 150])} />
      <circle cx="170" cy="150" r="10" fill="#F4EDE0" />
    </g>
  );
}

function Plank({ s }) {
  const hy = 152 + 3 * s;
  return (
    <g>
      <polyline {...line} points={pts([25, 170], [95, hy], [140, 148])} />
      <polyline {...arm} points={pts([140, 148], [160, 170])} />
      <circle cx="156" cy="138" r="10" fill="#F4EDE0" />
    </g>
  );
}

function Hang({ m, s }) {
  const pull = m === 'pullup';
  const sy = pull ? 92 - 52 * s : 95, S = [100, sy], hip = [100, sy + 58];
  const th = pull ? 8 : 85 * s, K = seg(hip, th, 45), Fz = seg(K, pull ? th - 20 : th - (80 * s + 5), 45);
  const E = [100 + (pull ? 16 * s : 0), (18 + sy) / 2];
  return (
    <g>
      <line x1="60" y1="18" x2="140" y2="18" stroke="#FF6B5B" strokeWidth="4" strokeLinecap="round" />
      <polyline {...arm} points={pts([100, 18], E, S)} />
      <polyline {...line} points={pts(S, hip, K, Fz)} />
      <circle cx="100" cy={sy - 16} r="10" fill="#F4EDE0" />
    </g>
  );
}

function LegPress({ s }) {
  const H = [70, 160], N = [35, 120], d = 62 + 26 * s, a = 40;
  const F = [H[0] + d * Math.cos(rad(a)), H[1] - d * Math.sin(rad(a))];
  const h = Math.sqrt(Math.max(0, 45 * 45 - (d / 2) ** 2)), n = [-Math.sin(rad(a)), -Math.cos(rad(a))];
  const K = [(H[0] + F[0]) / 2 + h * n[0], (H[1] + F[1]) / 2 + h * n[1]];
  return (
    <g>
      <line x1="30" y1="125" x2="75" y2="165" stroke="#2a2c31" strokeWidth="10" strokeLinecap="round" />
      <line x1={F[0] + 16 * n[0]} y1={F[1] + 16 * n[1]} x2={F[0] - 16 * n[0]} y2={F[1] - 16 * n[1]} stroke="#FF6B5B" strokeWidth="6" strokeLinecap="round" />
      <polyline {...line} points={pts(F, K, H, N)} />
      <circle cx="27" cy="112" r="10" fill="#F4EDE0" />
    </g>
  );
}

function Run({ m, t }) {
  const c = RUN[m], ph = t * 2 * Math.PI * c.sp, hy = 100 - 3 * Math.abs(Math.sin(ph)), H = [100, hy];
  const N = seg(H, 180 - c.lean, 58);
  const legs = [0, Math.PI].map((o, i) => {
    const th = c.off + c.amp * Math.sin(ph + o), bend = 12 + c.kb * Math.max(0, Math.cos(ph + o));
    const K = seg(H, th, 45), F = seg(K, th - bend, 45);
    const u = -c.arm * Math.sin(ph + o), E = seg(N, u, 32), D = seg(E, u + 85, 30);
    return { K, F, E, D, i };
  });
  return (
    <g>
      <line x1="20" y1="194" x2="180" y2="194" stroke="#6b6e76" strokeWidth="2" strokeDasharray="10 8" strokeDashoffset={-t * 300} />
      {legs.map(({ K, F, E, D, i }) => (
        <g key={i} opacity={i ? 0.5 : 1}>
          <polyline {...line} points={pts(H, K, F)} />
          <polyline {...arm} points={pts(N, E, D)} />
        </g>
      ))}
      <polyline {...line} points={pts(H, N)} />
      <circle cx={seg(N, 180 - c.lean, 17)[0]} cy={seg(N, 180 - c.lean, 17)[1]} r="10" fill="#F4EDE0" />
    </g>
  );
}

function Bike({ t }) {
  const C = [100, 158], H = [78, 112], ph = t * 2 * Math.PI * 3;
  const ped = [ph, ph + Math.PI].map((a) => [C[0] + 17 * Math.cos(a), C[1] + 17 * Math.sin(a)]);
  const N = [116, 84];
  return (
    <g>
      <circle cx="48" cy="170" r="26" fill="none" stroke="#6b6e76" strokeWidth="3" /><circle cx="152" cy="170" r="26" fill="none" stroke="#6b6e76" strokeWidth="3" />
      <polyline points={pts([48, 170], C, [82, 118], [140, 100], [152, 170])} fill="none" stroke="#6b6e76" strokeWidth="3" />
      {ped.map((P, i) => <polyline key={i} {...line} opacity={i ? 0.5 : 1} points={pts(H, ik(H, P, 45, 45), P)} />)}
      <polyline {...line} points={pts(H, N)} />
      <polyline {...arm} points={pts(N, [134, 98], [142, 98])} />
      <circle cx="126" cy="68" r="10" fill="#F4EDE0" />
    </g>
  );
}

function Rower({ s }) {
  const F = [168, 150], H = [F[0] - (56 + 34 * s), 142], K = ik(H, F, 45, 45);
  const N = seg(H, 180 - (28 - 53 * s), 55);
  const hand = [N[0] + 40 - 26 * s, N[1] + 14], E = [(N[0] + hand[0]) / 2, (N[1] + hand[1]) / 2 + 8];
  return (
    <g>
      <line x1="20" y1="156" x2="184" y2="156" stroke="#6b6e76" strokeWidth="3" /><circle cx="176" cy="138" r="14" fill="none" stroke="#6b6e76" strokeWidth="3" />
      <polyline {...line} points={pts(F, K, H, N)} />
      <polyline {...arm} points={pts(N, E, hand)} />
      <circle cx={seg(N, 180 - (28 - 53 * s), 17)[0]} cy={seg(N, 180 - (28 - 53 * s), 17)[1]} r="10" fill="#F4EDE0" />
      <circle cx={hand[0]} cy={hand[1]} r="6" fill="#FF6B5B" />
    </g>
  );
}

function Climber({ t }) {
  const a = (Math.sin(t * 2 * Math.PI * 4) + 1) / 2, hip = [95, 150], sh = [140, 146];
  const leg = (v) => [[65 + 55 * v, 162 - 4 * v], [30 + 74 * v, 172]];
  return (
    <g>
      {[a, 1 - a].map((v, i) => { const [K, F] = leg(v); return <polyline key={i} {...line} opacity={i ? 0.5 : 1} points={pts(hip, K, F)} />; })}
      <polyline {...line} points={pts(hip, sh)} />
      <polyline {...arm} points={pts(sh, [140, 172])} />
      <circle cx="156" cy="138" r="10" fill="#F4EDE0" />
    </g>
  );
}

export function Figure({ id, t }) {
  const s = (1 - Math.cos(t * 2 * Math.PI)) / 2;
  const [m, eq, opt] = SPEC[id] || [];
  const standing = Boolean(STAND[m]);
  let body = null;
  if (standing) body = <Standing m={m} eq={eq} opt={opt} s={s} />;
  else if (LYING[m]) body = <Lying m={m} eq={eq} opt={opt} s={s} />;
  else if (m === 'skull') body = <Skull s={s} />;
  else if (m === 'legraise') body = <LegRaise s={s} />;
  else if (m === 'plank') body = <Plank s={s} />;
  else if (m === 'pullup' || m === 'hangknee') body = <Hang m={m} s={s} />;
  else if (m === 'legpress') body = <LegPress s={s} />;
  else if (RUN[m]) body = <Run m={m} t={t} />;
  else if (m === 'bike') body = <Bike t={t} />;
  else if (m === 'rower') body = <Rower s={s} />;
  else if (m === 'climber') body = <Climber t={t} />;
  const floor = standing || RUN[m] ? 194 : { bike: 198, rower: 198, climber: 176 }[m] ?? (m === 'pullup' || m === 'hangknee' ? 198 : 174);
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Exercise movement animation">
      <rect x="20" y={floor} width="160" height="5" rx="2.5" fill="#2a2c31" />
      {body}
    </svg>
  );
}

export default function ExerciseFigure({ id }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setT((x) => x + 0.014), 40);
    return () => clearInterval(timer);
  }, []);
  return <Figure id={id} t={t} />;
}
