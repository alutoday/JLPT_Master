/**
 * Placeholder Pages
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Award,
  Calendar,
  CircleCheckBig
} from 'lucide-react';
import { dataService } from '../services';
import { useAuthStore } from '../store/useAuthStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { ITestAttempt } from '../types';

export function HistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [testAttempts, setTestAttempts] = useState<ITestAttempt[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await dataService.getTestAttempts(user!.id);
      setTestAttempts(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const completedTests = testAttempts.filter(t => t.is_completed).length;
  const incompleteTests = testAttempts.filter(t => !t.is_completed).length;
  const avgScore = testAttempts.length > 0
    ? testAttempts.filter(t => t.total_score !== null).reduce((sum, t) => sum + (t.total_score || 0), 0) / testAttempts.filter(t => t.total_score !== null).length
    : 0;
  const highestScore = testAttempts.length > 0
    ? Math.max(...testAttempts.map(t => t.total_score || 0))
    : 0;

  // Generate activity heatmap data (full year - 53 weeks)
  const generateActivityData = () => {
    const year = selectedYear;
    const startDate = new Date(year, 0, 1); // January 1st
    
    // Adjust to start from Sunday
    const startDay = startDate.getDay();
    const adjustedStart = new Date(startDate);
    adjustedStart.setDate(adjustedStart.getDate() - startDay);

    const activityMap = new Map<string, number>();
    
    // Count attempts per day
    testAttempts.forEach(attempt => {
      const attemptDate = new Date(attempt.started_at);
      if (attemptDate.getFullYear() === year) {
        const date = attemptDate.toISOString().split('T')[0];
        activityMap.set(date, (activityMap.get(date) || 0) + 1);
      }
    });

    // Generate grid data (53 weeks * 7 days)
    const data: { date: string; count: number; day: number; week: number }[] = [];
    for (let week = 0; week < 53; week++) {
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(adjustedStart);
        currentDate.setDate(adjustedStart.getDate() + (week * 7) + day);
        const dateStr = currentDate.toISOString().split('T')[0];
        data.push({
          date: dateStr,
          count: activityMap.get(dateStr) || 0,
          day,
          week,
        });
      }
    }
    return data;
  };

  const activityData = generateActivityData();

  // Get available years - show last 5 years
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: 5 }, 
    (_, i) => currentYear - i
  );

  const getActivityColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-700';
    if (count === 1) return 'bg-green-200 dark:bg-green-400/30';
    if (count === 2) return 'bg-green-400 dark:bg-green-400/50';
    if (count === 3) return 'bg-green-500 dark:bg-green-400/70';
    return 'bg-green-600 dark:bg-green-400/90';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="読み込み中..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          学習履歴
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          あなたの学習記録と進捗を確認しましょう
        </p>
      </div>

      {/* Section 1: Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">
              {completedTests}
            </div>
          </div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            完了した試験
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">
              {incompleteTests}
            </div>
          </div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            未完了の試験
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">
              {avgScore.toFixed(0)}%
            </div>
          </div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            平均スコア
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">
              {highestScore}%
            </div>
          </div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            最高スコア
          </div>
        </div>
      </div>

      {/* Section 2: Activity Heatmap */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              学習アクティビティ
            </h2>
          </div>
          
          {/* Year Selector */}
          <div className="flex gap-2">
            {availableYears.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  selectedYear === year
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Month labels */}
            <div className="flex gap-[3px] mb-2 ml-8">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                <div key={month} className="text-xs text-gray-500 dark:text-gray-400" style={{ width: `${(53 / 12) * 11}px` }}>
                  {i % 2 === 0 ? month : ''}
                </div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            <div className="flex gap-[3px]">
              {/* Day labels */}
              <div className="flex flex-col gap-[3px] mr-2">
                <div className="h-[11px]" />
                <div className="h-[11px] text-xs text-gray-500 dark:text-gray-400">Mon</div>
                <div className="h-[11px]" />
                <div className="h-[11px] text-xs text-gray-500 dark:text-gray-400">Wed</div>
                <div className="h-[11px]" />
                <div className="h-[11px] text-xs text-gray-500 dark:text-gray-400">Fri</div>
                <div className="h-[11px]" />
              </div>
              
              {/* Week columns */}
              {Array.from({ length: 53 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const dataIndex = weekIndex * 7 + dayIndex;
                    const data = activityData[dataIndex];
                    const date = new Date(data?.date || '');
                    const isCurrentYear = date.getFullYear() === selectedYear;
                    
                    return (
                      <div
                        key={dayIndex}
                        className={`w-[11px] h-[11px] rounded-sm ${
                          isCurrentYear ? getActivityColor(data?.count || 0) : 'bg-gray-50 dark:bg-gray-900'
                        } transition-all hover:ring-2 hover:ring-gray-400 dark:hover:ring-gray-500 cursor-pointer`}
                        title={`${data?.date || ''}: ${data?.count || 0} tests`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
              <span>少ない</span>
              <div className="flex gap-1">
                <div className="w-[11px] h-[11px] rounded-sm bg-gray-100 dark:bg-gray-800" />
                <div className="w-[11px] h-[11px] rounded-sm bg-green-200 dark:bg-green-900/40" />
                <div className="w-[11px] h-[11px] rounded-sm bg-green-400 dark:bg-green-700/60" />
                <div className="w-[11px] h-[11px] rounded-sm bg-green-500 dark:bg-green-600/70" />
                <div className="w-[11px] h-[11px] rounded-sm bg-green-600 dark:bg-green-500/80" />
              </div>
              <span>多い</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Test Attempts List */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          試験履歴 ({testAttempts.length})
        </h2>
        
        {testAttempts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-12 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">まだ試験を受けていません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {testAttempts.map((attempt) => {
              const completedSections = attempt.sections?.filter(s => s.status === 'COMPLETED').length || 0;
              const totalSections = attempt.sections?.length || 0;

              return (
                <div
                  key={attempt.id}
                  onClick={() => navigate(`/testAttempts/${attempt.id}`)}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {attempt.is_completed ? (
                          <CircleCheckBig className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-blue-500" />
                        )}
                        <span 
                          className="font-semibold text-gray-900 dark:text-white"
                          dangerouslySetInnerHTML={{ __html: attempt.test_title }}
                        />
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          attempt.is_completed
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                            : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                        }`}>
                          {attempt.is_completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>
                            lúc {new Date(attempt.started_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} {new Date(attempt.started_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                        {attempt.is_completed && attempt.completed_at && (
                          <>
                            <span>•</span>
                            <span>
                              Hoàn thành: lúc {new Date(attempt.completed_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} {new Date(attempt.completed_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{totalSections} sections</span>
                        <span>•</span>
                        <span>{completedSections} hoàn thành</span>
                      </div>
                    </div>

                    {attempt.is_completed && attempt.total_score !== null && (
                      <div className="text-right ml-4">
                        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                          {attempt.total_score}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          Điểm trung bình
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Profile
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Profile page coming soon...
      </p>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Settings page coming soon...
      </p>
    </div>
  );
}
