export const ACTIVITY = [
  [1.2, 'Sedentary · desk job, little exercise'],
  [1.375, 'Light · exercise 1–3 days a week'],
  [1.55, 'Moderate · exercise 3–5 days a week'],
  [1.725, 'Hard · exercise 6–7 days a week'],
  [1.9, 'Very hard · physical job plus training'],
];
const CUTS = { who: { over: 25, obese: 30 }, asian: { over: 23, obese: 27.5 } };
export const cuts = (s) => CUTS[s] || CUTS.who;

export const toMetric = ({ weight, weightUnit, height, heightUnit }) => ({
  kg: weightUnit === 'lb' ? weight * 0.45359237 : weight,
  cm: heightUnit === 'in' ? height * 2.54 : height,
});
export const bmi = (kg, cm) => kg / (cm / 100) ** 2;

export function classify(b, scheme = 'who') {
  const c = cuts(scheme);
  if (b < 18.5) return 'Underweight';
  if (b < c.over) return 'Normal';
  if (b < c.obese) return 'Overweight';
  return 'Obese';
}
export function idealRange(cm, age, scheme = 'who') {
  const h2 = (cm / 100) ** 2;
  if (age >= 65) return [22 * h2, 27 * h2];
  return [18.5 * h2, (scheme === 'asian' ? 22.9 : 24.9) * h2];
}
export const devine = (cm, sex) => (sex === 'male' ? 50 : 45.5) + 2.3 * (cm / 2.54 - 60);
export const bmr = ({ kg, cm, age, sex }) => 10 * kg + 6.25 * cm - 5 * age + (sex === 'male' ? 5 : -161);

// Reasons a calorie-deficit plan must NOT be generated (empty array = OK)
export function gate({ b, flags }) {
  const r = [];
  if (flags.preg) r.push('Pregnancy or breastfeeding needs a plan from your doctor or dietitian.');
  if (flags.ed) r.push('A history of disordered eating needs support from a professional. Please speak with a doctor or registered dietitian.');
  if (flags.med) r.push('With a medical condition, calorie and macro targets should come from your doctor or dietitian.');
  if (b < 18.5) r.push('Your BMI is below 18.5, so a calorie deficit is not recommended.');
  return r;
}

export function plan({ kg, cm, age, sex, activity, deficit = 0.2 }) {
  const b = bmr({ kg, cm, age, sex });
  const tdee = b * activity;
  const floor = sex === 'male' ? 1500 : 1200;
  const raw = Math.round((tdee * (1 - Math.min(deficit, 0.25))) / 50) * 50;
  const kcal = Math.max(floor, raw);
  const refKg = bmi(kg, cm) >= 30 ? 25 * (cm / 100) ** 2 : kg;
  let protein = Math.round(1.8 * refKg);
  const fat = Math.round(Math.max(0.25 * kcal, 0.6 * kg * 9) / 9);
  let carbs = Math.round((kcal - protein * 4 - fat * 9) / 4);
  if (carbs < 100) { protein = Math.round(1.6 * refKg); carbs = Math.round((kcal - protein * 4 - fat * 9) / 4); }
  const fiber = Math.round(Math.min(40, Math.max((14 * kcal) / 1000, sex === 'male' ? 30 : 25)));
  const pct = { p: Math.round((protein * 400) / kcal), f: Math.round((fat * 900) / kcal) };
  pct.c = 100 - pct.p - pct.f;
  return {
    bmr: Math.round(b), tdee: Math.round(tdee), kcal, protein, fat, carbs, fiber, pct,
    deficitKcal: Math.round(tdee - kcal), weeklyLossKg: +(((tdee - kcal) * 7) / 7700).toFixed(2), floored: kcal > raw,
  };
}
