import { Home as HomeIcon, Dumbbell, Apple, CalendarDays, LayoutDashboard } from 'lucide-react';

const TABS = [
  ['Home', HomeIcon, 'Home'],
  ['Workouts', Dumbbell, 'Workouts'],
  ['Diet Plan', Apple, 'Diet'],
  ['Calendar', CalendarDays, 'Calendar'],
  ['Dashboard', LayoutDashboard, 'Stats'],
];

// Bottom tab bar for phones (shown on screens up to 760 px wide)
export default function TabBar({ page, onNavigate }) {
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map(([p, Icon, label]) => (
        <button key={p} className={page === p ? 'tab-item active' : 'tab-item'} onClick={() => { onNavigate(p); window.scrollTo({ top: 0 }); }}>
          <Icon size={22} /><span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
