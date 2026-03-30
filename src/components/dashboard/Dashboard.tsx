import { useMemo } from 'react';
import { useProgress } from '../../hooks/useProgress';
import { Flame, BookOpen, MessageCircle, Brain, TrendingUp } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';

export function Dashboard() {
  const { progress, computedStats } = useProgress();

  const streakDays = useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const activity = progress.dailyActivity[dateStr];
      const hasActivity = activity && (activity.cardsReviewed > 0 || activity.chatMinutes > 0 || activity.grammarCompleted > 0);

      days.push({
        date,
        dateStr,
        hasActivity,
        isToday: isSameDay(date, today),
      });
    }

    return days;
  }, [progress.dailyActivity]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Progress</h2>

      {/* Streak */}
      <div className="bg-gradient-to-r from-accent-500 to-orange-500 rounded-2xl p-5 text-white mb-4">
        <div className="flex items-center gap-3">
          <Flame size={32} />
          <div>
            <p className="text-3xl font-bold">{progress.currentStreak}</p>
            <p className="text-sm opacity-90">day streak</p>
          </div>
        </div>
        {progress.longestStreak > 0 && (
          <p className="text-xs opacity-75 mt-2">
            Longest streak: {progress.longestStreak} days
          </p>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard
          icon={<Brain size={20} className="text-primary-500" />}
          value={computedStats.wordsLearned}
          label="Words mastered"
        />
        <StatCard
          icon={<TrendingUp size={20} className="text-accent-600" />}
          value={computedStats.wordsInProgress}
          label="In progress"
        />
        <StatCard
          icon={<MessageCircle size={20} className="text-purple-500" />}
          value={progress.chatSessionCount}
          label="Chat sessions"
        />
        <StatCard
          icon={<BookOpen size={20} className="text-success-500" />}
          value={computedStats.grammarCompleted}
          label="Grammar done"
        />
      </div>

      {/* Vocabulary breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-4">
        <h3 className="font-semibold text-sm mb-3">Vocabulary Progress</h3>
        <div className="flex h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-3">
          {computedStats.wordsLearned > 0 && (
            <div
              className="bg-success-500"
              style={{ width: `${(computedStats.wordsLearned / computedStats.totalWords) * 100}%` }}
            />
          )}
          {computedStats.wordsInProgress > 0 && (
            <div
              className="bg-accent-500"
              style={{ width: `${(computedStats.wordsInProgress / computedStats.totalWords) * 100}%` }}
            />
          )}
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success-500" /> Mastered ({computedStats.wordsLearned})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-500" /> Learning ({computedStats.wordsInProgress})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" /> New ({computedStats.wordsNew})
          </span>
        </div>
      </div>

      {/* 30-day calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-sm mb-3">Last 30 Days</h3>
        <div className="grid grid-cols-10 gap-1.5">
          {streakDays.map(({ dateStr, hasActivity, isToday }) => (
            <div
              key={dateStr}
              className={`aspect-square rounded-sm ${
                hasActivity
                  ? 'bg-primary-500'
                  : 'bg-gray-100 dark:bg-gray-700'
              } ${isToday ? 'ring-2 ring-primary-400 ring-offset-1 dark:ring-offset-gray-800' : ''}`}
              title={dateStr}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
