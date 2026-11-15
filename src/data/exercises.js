import { LEVELS } from './levels.js';

// [id, name, muscle, kind (c=compound, i=isolation, a=abs), difficulty 1-3, motion, how-to, common mistake]
const RAW = [
['dbcurl','Dumbbell Bicep Curl','Biceps','i',1,'curl','Elbows pinned to your sides, curl both dumbbells up, squeeze, lower for 3 seconds.','Swinging the torso to heave the weight up.'],
['hammer','Hammer Curl','Biceps','i',1,'curl','Palms facing in, curl without rotating the wrists and keep the upper arms still.','Letting the elbows drift forward.'],
['barcurl','Barbell Curl','Biceps','i',2,'curl','Shoulder-width grip, curl the bar to chest height with strict form.','Leaning back to cheat the last reps.'],
['conc','Concentration Curl','Biceps','i',1,'curl','Seated with the elbow braced on your inner thigh, curl slowly and squeeze at the top.','Rushing the lowering phase.'],
['cablecurl','Cable Curl','Biceps','i',1,'curl','Face the stack, elbows tucked, curl the handle up against steady tension.','Stepping back and using body momentum.'],
['inclcurl','Incline Dumbbell Curl','Biceps','i',2,'curl','Lie back on a 45° bench with arms hanging, then curl for a deep stretch.','Pulling the shoulders forward off the bench.'],
['bwsquat','Bodyweight Squat','Legs','c',1,'squat','Feet shoulder-width, sit hips back and down, drive up through the mid-foot.','Knees caving inward.'],
['goblet','Goblet Squat','Legs','c',1,'squat','Hold one dumbbell at the chest and squat deep with an upright torso.','Heels lifting off the floor.'],
['backsquat','Barbell Back Squat','Legs','c',3,'squat','Bar on the upper back, brace the core, squat to parallel or below, stand tall.','Rounding the lower back at the bottom.'],
['legpress','Leg Press','Legs','c',1,'squat','Feet shoulder-width on the platform, lower under control, press without locking the knees.','Lifting the hips off the seat.'],
['lunge','Walking Lunge','Legs','c',2,'lunge','Take a long step, drop the back knee toward the floor, push through the front heel.','Short steps that overload the front knee.'],
['bss','Bulgarian Split Squat','Legs','c',3,'lunge','Rear foot on a bench, lower straight down on the front leg, then drive up.','Standing too close to the bench.'],
['rdl','Romanian Deadlift','Legs','c',2,'hinge','Soft knees, push the hips back with a flat spine, feel the hamstring stretch, stand tall.','Rounding the spine or squatting the movement.'],
['calf','Standing Calf Raise','Legs','i',1,'calf','Rise onto the balls of your feet, pause at the top, lower to a full stretch.','Bouncing instead of pausing.'],
['machpress','Machine Chest Press','Chest','c',1,'push','Set the seat so the handles meet mid-chest, press out, return slowly.','Shrugging the shoulders toward the ears.'],
['dbbench','Dumbbell Bench Press','Chest','c',2,'bench','Shoulder blades pinched, lower to chest level, press up over the chest.','Flaring the elbows out to 90°.'],
['inclpress','Incline Dumbbell Press','Chest','c',2,'bench','Bench at 30°, press up and slightly in, control the descent.','Setting the bench too steep, shifting work to the shoulders.'],
['barbench','Barbell Bench Press','Chest','c',3,'bench','Eyes under the bar, feet planted, lower to the lower chest and press explosively.','Bouncing the bar off the chest.'],
['cablefly','Cable Fly','Chest','i',2,'push','Slight elbow bend, sweep the handles together in a hugging arc.','Turning the fly into a press.'],
['pecdeck','Pec Deck','Chest','i',1,'push','Back flat on the pad, bring the handles together, squeeze, return slowly.','Letting the weight stack slam down.'],
['pushdown','Triceps Pushdown','Triceps','i',1,'pd','Elbows locked to your sides, press the bar down to full extension, return slowly.','Letting the elbows flare or drift forward.'],
['ropepd','Rope Pushdown','Triceps','i',1,'pd','Split the rope at the bottom and squeeze, keeping the upper arms still.','Leaning over the stack.'],
['ohext','Overhead Dumbbell Extension','Triceps','i',2,'ext','Hold one dumbbell overhead, lower it behind the head, extend fully.','Flaring the elbows wide.'],
['skull','Skull Crusher','Triceps','i',2,'ext','Lying down, lower the weight toward the forehead, extend without moving the upper arms.','Letting the elbows travel backward.'],
['kick','Triceps Kickback','Triceps','i',1,'kick','Hinge forward, upper arm parallel to the floor, extend the forearm back and squeeze.','Swinging the upper arm.'],
['cgbench','Close-Grip Bench Press','Triceps','c',3,'bench','Hands shoulder-width, elbows tucked, lower to the lower chest, press up.','Gripping too narrow, which stresses the wrists.'],
['dbpress','Dumbbell Shoulder Press','Shoulders','c',2,'press','Press overhead until the arms are straight, lower to ear level.','Arching the lower back.'],
['arnold','Arnold Press','Shoulders','c',2,'press','Start palms facing you, rotate as you press overhead, reverse on the way down.','Rushing the rotation.'],
['ohp','Barbell Overhead Press','Shoulders','c',3,'press','Squeeze the glutes, press the bar straight overhead, head through at the top.','Leaning back instead of bracing.'],
['lat','Lateral Raise','Shoulders','i',1,'raise','Slight elbow bend, raise the arms to shoulder height, lower slowly.','Using momentum and shrugging.'],
['front','Front Raise','Shoulders','i',1,'raise','Raise the weights to eye level with upright posture, lower under control.','Swinging the body.'],
['rear','Rear Delt Fly','Shoulders','i',2,'raise','Hinge forward, raise the arms out to the sides, squeeze the shoulder blades.','Shrugging with the traps.'],
['face','Face Pull','Shoulders','i',2,'row','Pull the rope toward your face with elbows high and squeeze the rear delts.','Using a load that is too heavy.'],
['crunch','Crunch','Abs','a',1,'crunch','Lie back with knees bent, curl the ribs toward the hips, exhale at the top.','Pulling on the neck.'],
['plank','Plank','Abs','a',1,'hold','Forearms down, body in a straight line, brace the core; hold 30–60 seconds.','Sagging hips.'],
['legraise','Lying Leg Raise','Abs','a',2,'crunch','Press the lower back down, raise straight legs to vertical, lower slowly.','Lower back arching off the floor.'],
['bicycle','Bicycle Crunch','Abs','a',1,'crunch','Slowly bring the opposite elbow to the knee while extending the other leg.','Twisting fast and yanking the neck.'],
['russian','Russian Twist','Abs','a',2,'crunch','Lean back with feet off the floor and rotate the shoulders side to side.','Moving only the arms.'],
['cablecrunch','Cable Crunch','Abs','a',2,'crunch','Kneel facing the stack, curl the ribs to the pelvis, hold briefly.','Pulling with the arms while the hips move.'],
['hangknee','Hanging Knee Raise','Abs','a',3,'crunch','Hang from a bar and lift the knees above hip height without swinging.','Using momentum.'],
['pullup','Pull-Up','Back','c',3,'pull','From a full hang, pull the chest toward the bar, lower under control.','Half reps and kipping.'],
['barrow','Barbell Row','Back','c',3,'row','Hinge to about 45°, row the bar to the lower ribs, squeeze the shoulder blades.','Standing up between reps.'],
['cablerow','Seated Cable Row','Back','c',1,'row','Sit tall, pull the handle to the navel with elbows close, return slowly.','Rocking the torso.'],
['dbrow','Single-Arm Dumbbell Row','Back','c',2,'row','Hand and knee on a bench, row the dumbbell to the hip.','Twisting the torso.'],
['strarm','Straight-Arm Pulldown','Back','i',2,'pull','Arms nearly straight, sweep the bar to the thighs using the lats.','Bending the elbows into a pushdown.'],
['walk','Brisk Treadmill Walk','Cardio','k',1,'walk','Set a slight incline, walk tall with relaxed arm swing at a pace where you can still talk.','Gripping the handrails and leaning back.'],
['jog','Treadmill Jog','Cardio','k',2,'run','Land softly under your hips, keep a steady rhythm and breathe in a 2:2 pattern.','Over-striding, which jars the knees.'],
['sprint','Treadmill Sprint Intervals','Cardio','h',3,'run','Sprint hard for the work period, then drop to an easy walk or jog to recover.','Starting too fast and fading after two rounds.'],
['bike','Stationary Bike','Cardio','k',1,'bike','Set the saddle at hip height, pedal in smooth circles and keep the upper body relaxed.','Saddle too low, which strains the knees.'],
['elliptical','Elliptical Trainer','Cardio','k',1,'glide','Stand tall, push and pull the handles and keep your whole foot on the pedals.','Leaning heavily on the handles.'],
['stairs','Stair Climber','Cardio','k',2,'stairs','Step fully onto each stair with a tall chest and light hands on the rails.','Leaning on the rails and hunching over.'],
['rower','Rowing Machine','Cardio','k',2,'rower','Drive with the legs first, then lean back and pull the handle to the chest; reverse the order on the return.','Pulling with the arms before the legs have driven.'],
['rope','Jump Rope','Cardio','h',2,'jump','Stay on the balls of your feet, small jumps, wrists turn the rope.','Jumping too high and landing with stiff legs.'],
['hknee','High Knees','Cardio','h',2,'highknee','Run on the spot driving the knees to hip height, pumping the arms.','Leaning back and landing on the heels.'],
['climbers','Mountain Climbers','Cardio','h',2,'climber','From a plank, drive the knees to the chest alternately while keeping the hips low.','Bouncing the hips up high.'],
];

export const EXERCISES = Object.fromEntries(
  RAW.map(([id, name, muscle, kind, diff, motion, how, mistake]) => [id, { id, name, muscle, kind, diff, motion, how, mistake }])
);
export const DIFF = ['', 'Easy', 'Medium', 'Hard'];

// [sets, reps, rest seconds] by exercise kind
const SCHEME = {
  beginner: { c: [3, '10', 90], i: [3, '12', 60], a: [3, '15', 45], k: [1, '10 min', 0], h: [4, '20 s on / 40 s off', 60] },
  intermediate: { c: [4, '8–10', 90], i: [3, '10–12', 60], a: [3, '15–20', 45], k: [1, '15 min', 0], h: [6, '30 s on / 30 s off', 60] },
  expert: { c: [4, '6–8', 120], i: [4, '8–12', 75], a: [4, '15–20', 45], k: [1, '20 min', 0], h: [8, '40 s on / 20 s off', 60] },
};
const INTEN = {
  beginner: { k: 'Easy · RPE 4–5', h: 'Hard bursts · RPE 7' },
  intermediate: { k: 'Moderate · RPE 6', h: 'Hard bursts · RPE 8' },
  expert: { k: 'Hard · RPE 7', h: 'All-out bursts · RPE 9' },
};
const TEMPO = { c: '2-1-1-0', i: '3-1-1-0', a: '2-0-2-1' };
const RIR = { beginner: 3, intermediate: 2, expert: 1 };
export const CARDIO_TIP = 'Pick 2–3 options and finish in 20–45 minutes. Keep a talking pace on steady work and go hard only on interval bursts. Do cardio after weights, not before.';
export const chipOf = (e) => (e.kind === 'k' ? e.reps : e.kind === 'h' ? `${e.sets} rounds` : `${e.sets} × ${e.reps}`);
export const TIPS = {
  beginner: 'Focus on form with light weights. Add 1–2 reps per set each week before adding load.',
  intermediate: 'Progressive overload: add 2.5 kg or 1 rep to every set each week. Stop 1–2 reps short of failure.',
  expert: 'Heavy compounds first. Take a deload week every 6–8 weeks. Sleep 7–9 hours and eat enough protein.',
};

export const PROGRAMS = {
  beginner: [
    ['dbcurl', 'hammer', 'barcurl', 'conc', 'cablecurl'],
    ['bwsquat', 'legpress', 'lunge', 'rdl', 'calf'],
    ['machpress', 'dbbench', 'inclpress', 'cablefly', 'pecdeck'],
    ['pushdown', 'ohext', 'kick', 'ropepd', 'skull'],
    ['dbpress', 'lat', 'front', 'rear', 'face'],
    ['crunch', 'plank', 'legraise', 'bicycle', 'russian'],
  ],
  intermediate: [
    ['dbcurl', 'hammer', 'barcurl', 'conc', 'cablecurl', 'inclcurl'],
    ['goblet', 'legpress', 'lunge', 'rdl', 'bss', 'calf'],
    ['dbbench', 'inclpress', 'machpress', 'cablefly', 'pecdeck', 'barbench'],
    ['pushdown', 'ohext', 'skull', 'kick', 'ropepd', 'cgbench'],
    ['dbpress', 'lat', 'front', 'rear', 'face', 'arnold'],
    ['crunch', 'plank', 'legraise', 'bicycle', 'russian', 'cablecrunch'],
  ],
  expert: [
    ['backsquat', 'rdl', 'bss', 'barcurl', 'inclcurl', 'hammer'],
    ['barbench', 'inclpress', 'cablefly', 'ohp', 'lat', 'rear'],
    ['pullup', 'barrow', 'cablerow', 'dbrow', 'hammer', 'cablecurl'],
    ['legpress', 'lunge', 'calf', 'hangknee', 'plank', 'russian'],
    ['dbbench', 'inclpress', 'pecdeck', 'cgbench', 'skull', 'ohext', 'pushdown'],
    ['dbpress', 'arnold', 'lat', 'face', 'cablecrunch', 'legraise', 'plank'],
  ],
};

export const CARDIO = {
  beginner: ['walk', 'bike', 'elliptical', 'stairs', 'rower'],
  intermediate: ['jog', 'bike', 'rower', 'stairs', 'rope', 'climbers'],
  expert: ['sprint', 'rower', 'rope', 'hknee', 'climbers', 'stairs'],
};

export function getDay(level, i) {
  const cardio = i === 'cardio';
  const name = cardio ? 'Cardio' : LEVELS.find((l) => l.id === level).split[i];
  const ids = cardio ? CARDIO[level] : PROGRAMS[level][i];
  const exercises = ids.map((id) => {
    const e = EXERCISES[id];
    const [sets, reps, rest] = SCHEME[level][e.kind];
    return { ...e, sets, reps, rest, inten: INTEN[level][e.kind], tempo: TEMPO[e.kind], rir: RIR[level] };
  });
  return { name, exercises };
}

export function allExercises(level) {
  const seen = new Set();
  return [...PROGRAMS[level].map((_, d) => d), 'cardio'].flatMap((d) => getDay(level, d).exercises.map((e) => ({ ...e, day: d })))
    .filter((e) => (seen.has(e.id) ? false : seen.add(e.id)));
}
