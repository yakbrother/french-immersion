import { NavLink } from 'react-router-dom';
import { Layers, MessageCircle, BookOpen, BarChart3 } from 'lucide-react';

const tabs = [
  { to: '/', icon: Layers, label: 'Cards' },
  { to: '/chat', icon: MessageCircle, label: 'Chat' },
  { to: '/grammar', icon: BookOpen, label: 'Grammar' },
  { to: '/dashboard', icon: BarChart3, label: 'Progress' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[64px] min-h-[44px] transition-colors ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            <Icon size={22} />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
