const ITEMS = ['BMI and ideal weight range', 'Daily calories with a safe 15–25% deficit', 'Protein, carbs, fat and fiber targets', 'Safety checks before any plan'];

export default function UpcomingDiet({ compact = false, onMore }) {
  return (
    <div className="card upcoming">
      <div>
        <span className="badge">New</span>
        <h3>Diet plan</h3>
        <p className="muted">Check your BMI and healthy weight range, then get daily calorie, macro and fiber targets for weight loss.{!compact && ' Meal ideas and a meal log are coming next.'}</p>
        {onMore && <button className="btn primary" style={{ marginTop: '1rem' }} onClick={onMore}>Open Diet Plan</button>}
      </div>
      {!compact && <ul className="plan">{ITEMS.map((t) => <li key={t}>{t}<span className="muted">Ready</span></li>)}</ul>}
    </div>
  );
}
