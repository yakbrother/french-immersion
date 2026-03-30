import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { useTheme } from '../../hooks/useTheme';

export function AppShell() {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="max-w-lg mx-auto px-4 pt-4 pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
