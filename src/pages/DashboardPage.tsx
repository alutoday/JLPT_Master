/**
 * Dashboard Page - Shows all available tests with filters
 * Same as TestsPage functionality
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Sparkles } from 'lucide-react';
import { dataService } from '../services';
import type { ITest, JLPTLevel } from '../types';
import { HTMLRenderer } from '../components/HTMLRenderer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuthStore } from '../store/useAuthStore';

export function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [tests, setTests] = useState<ITest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'ALL'>('ALL');
  const [selectedYear, setSelectedYear] = useState<number | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'ATTEMPTED' | 'NOT_ATTEMPTED'>('ALL');

  const levels: Array<JLPTLevel | 'ALL'> = ['ALL', 'N1', 'N2', 'N3', 'N4', 'N5'];
  const years = [2024, 2023, 2022, 2021, 2020];

  useEffect(() => {
    fetchTests();
  }, [selectedLevel, selectedYear, selectedStatus]);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const filter = {
        level: selectedLevel !== 'ALL' ? selectedLevel : undefined,
        year: selectedYear !== 'ALL' ? selectedYear : undefined,
      };
      let data = await dataService.getTests(filter);
      
      // Filter by status
      if (selectedStatus === 'ATTEMPTED') {
        data = data.filter(test => test.is_attempted);
      } else if (selectedStatus === 'NOT_ATTEMPTED') {
        data = data.filter(test => !test.is_attempted);
      }
      
      setTests(data);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: JLPTLevel) => {
    const colors = {
      N1: 'from-red-500 to-pink-500',
      N2: 'from-orange-500 to-amber-500',
      N3: 'from-yellow-500 to-lime-500',
      N4: 'from-green-500 to-emerald-500',
      N5: 'from-blue-500 to-cyan-500',
    };
    return colors[level];
  };

  const getLevelBadgeColor = (level: JLPTLevel) => {
    const colors = {
      N1: 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30',
      N2: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30',
      N3: 'bg-gradient-to-r from-yellow-500 to-lime-500 text-white shadow-lg shadow-yellow-500/30',
      N4: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30',
      N5: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30',
    };
    return colors[level];
  };

  const renderTestCard = (test: ITest) => {
    const isAttempted = test.is_attempted || false;

    return (
      <div
        key={test.id}
        className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer hover:-translate-y-1"
        onClick={() => navigate(`/tests/${test.id}`)}
      >
        {/* Gradient Top Bar */}
        <div className={`h-1.5 bg-gradient-to-r ${getLevelColor(test.level)}`} />
        
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-3">
              <HTMLRenderer
                content={test.title}
                className="text-base font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-primary-400 transition-all"
              />
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getLevelBadgeColor(test.level)}`}>
                  {test.level}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">
                  {test.year}.{String(test.month).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Status - Attempted / Not Started */}
          <div className="mb-4">
            {isAttempted ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-semibold">Đã làm</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-semibold">Chưa làm</span>
              </div>
            )}
          </div>

          {/* CTA with Arrow */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
              {isAttempted ? 'Xem lại' : 'Bắt đầu'}
            </span>
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:bg-primary-600 dark:group-hover:bg-primary-500 transition-all group-hover:scale-110">
              <span className="text-primary-600 dark:text-primary-400 group-hover:text-white font-bold group-hover:translate-x-0.5 transition-all">→</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Header - Modern & Clean */}
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-300 mb-2">
              {t('dashboard.title', 'Practice Tests')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {t('dashboard.subtitle', 'Choose a test to start practicing')}
            </p>
          </div>
          {!loading && tests.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-bold text-primary-700 dark:text-primary-300">
                {tests.length} {tests.length === 1 ? 'test' : 'tests'} available
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Bar - Sleek & Compact */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Level Pills */}
        <div className="flex items-center gap-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                selectedLevel === level
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {level === 'ALL' ? '🌟 All' : level}
            </button>
          ))}
        </div>

        <div className="hidden sm:block w-px h-8 bg-gray-300 dark:bg-gray-700" />

        {/* Status Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as 'ALL' | 'ATTEMPTED' | 'NOT_ATTEMPTED')}
          className="px-4 py-2 rounded-full text-sm font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all cursor-pointer hover:border-primary-300"
        >
          <option value="ALL">📋 Tất cả trạng thái</option>
          <option value="ATTEMPTED">✅ Đã làm</option>
          <option value="NOT_ATTEMPTED">✨ Chưa làm</option>
        </select>

        {/* Year Dropdown */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))}
          className="px-4 py-2 rounded-full text-sm font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all cursor-pointer hover:border-primary-300"
        >
          <option value="ALL">📅 All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              📅 {year}
            </option>
          ))}
        </select>
      </div>

      {/* Test Grid */}
      {loading ? (
        <LoadingSpinner text={t('common.loading')} />
      ) : tests.length === 0 ? (
        <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <p className="text-lg font-bold text-gray-600 dark:text-gray-400">{t('tests.noTests')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {tests.map(renderTestCard)}
        </div>
      )}
    </div>
  );
}
