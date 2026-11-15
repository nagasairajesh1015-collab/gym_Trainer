export const WARMUP_GENERAL = ['3 min easy cardio: bike, brisk walk or jump rope', '30 s each of neck, shoulder, hip and ankle circles'];
export const DYNAMIC = {
  Biceps: 'Arm circles and light band curls, 10 each',
  Triceps: 'Arm swings and band pushdowns, 10 each',
  Chest: 'Band pull-aparts and doorway chest openers, 12 each',
  Back: 'Cat-cow ×8 and scapular push-ups ×10',
  Shoulders: 'Band shoulder dislocates ×10 and wall slides ×10',
  Legs: 'Bodyweight squats ×10 and leg swings ×10 each side',
  Abs: 'Dead bugs ×8 each side and glute bridges ×10',
};
export const STRETCH = {
  Biceps: 'Wall biceps stretch, 30 s each arm',
  Triceps: 'Overhead triceps stretch, 30 s each arm',
  Chest: 'Doorway chest stretch, 30 s',
  Back: 'Child’s pose, 40 s',
  Shoulders: 'Cross-body shoulder stretch, 30 s each arm',
  Legs: 'Standing quad stretch and seated hamstring stretch, 30 s each leg',
  Abs: 'Cobra stretch, 30 s',
};
export const RAMP = 'Ramp-up: do 1–2 light sets of your first lift (about 50% then 70% of working weight) before your real sets.';
export const PROGRESSION = {
  beginner: 'Add reps until you hit the top of the range on every set, then add 2.5–5% weight. Deload every 8 weeks.',
  intermediate: 'Add 1 rep per set each week, then add weight. If you stall for 2 weeks, drop 10% and rebuild. Deload in week 5–6.',
  expert: 'If your last set finishes with 2+ reps in reserve, add 2.5–5% (upper body) or 5–10% (lower body) next time. Deload every 6–8 weeks, cutting volume 40–50%.',
};
export const musclesOf = (name) => name.split(' + ').map((m) => (m === 'Core' ? 'Abs' : m));
