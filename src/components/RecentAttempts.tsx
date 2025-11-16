/**
 * Recent Attempts Component
 * Shows user's recent test attempts
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle } from 'lucide-react';
import { dataService } from '../services';
import { useAuthStore } from '../store/useAuthStore';
import type { ITestAttempt } from '../types';

export function RecentAttempts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [attempts, setAttempts] = useState<ITestAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      if (!user) return;

      try {
        const data = await dataService.getTestAttempts(user.id);
        // Sort by started_at descending and take latest 5
        const sortedData = data.sort((a, b) => 
          new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
        );
        setAttempts(sortedData.slice(0, 5));
      } catch (error) {
        console.error('Error fetching attempts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [user]);

  const getStatusIcon = (isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else {
      return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('dashboard.recentAttempts')}
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-16 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {t('dashboard.recentAttempts')}
        </h3>
        {attempts.length > 0 && (
          <button
            onClick={() => navigate('/history')}
            className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            {t('dashboard.viewAll')} →
          </button>
        )}
      </div>

      <div className="space-y-3">
        {attempts.length === 0 ? (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">{t('dashboard.noAttempts')}</p>
          </div>
        ) : (
          attempts.map((attempt) => (
            <div
              key={attempt.id}
              className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer border border-gray-200 dark:border-gray-700"
              onClick={() => navigate(`/testAttempts/${attempt.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(attempt.is_completed)}
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">
                      {attempt.level}
                    </span>
                  </div>
                  <p
                    className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                    dangerouslySetInnerHTML={{
                      __html: attempt.test_title.replace(/<[^>]*>/g, ''),
                    }}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {formatDate(attempt.started_at)} • {attempt.sections.length} sections
                  </p>
                </div>
                {attempt.is_completed && attempt.total_score !== null && (
                  <div className="ml-3 flex flex-col items-end">
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-primary-400">
                      {attempt.total_score}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Score
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
