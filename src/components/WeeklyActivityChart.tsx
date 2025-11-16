/**
 * Weekly Activity Chart Component
 * Shows completed tests count for each day of current week
 */

import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

export function WeeklyActivityChart() {
  const { t } = useTranslation();

  // Get current day of week (0 = Sunday, 6 = Saturday)
  const today = new Date().getDay();

  // Mock data for weekly activity (completed tests per day)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const data = weekDays.map((day, index) => ({
    day,
    completed: Math.floor(Math.random() * 5), // Mock: number of completed tests
    isToday: index === today,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {t('dashboard.weeklyActivity')}
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          Last 7 days
        </div>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <XAxis
              dataKey="day"
              tick={{ fill: 'currentColor', fontSize: 11 }}
              className="text-gray-600 dark:text-gray-400"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'currentColor', fontSize: 11 }}
              className="text-gray-600 dark:text-gray-400"
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isToday ? '#6366f1' : '#9ca3af'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-indigo-600"></span>
          Today
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-400"></span>
          Other days
        </span>
      </div>
    </div>
  );
}
