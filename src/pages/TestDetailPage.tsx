/**
 * TestDetailPage Component
 * Section selection page with Start/Resume/Review buttons
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { dataService } from '../services';
import type { ITestDetail, ISectionWithParts } from '../types';
import { HTMLRenderer } from '../components/HTMLRenderer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuthStore } from '../store/useAuthStore';
import { SectionList } from '../components/SectionList';

export const TestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const [test, setTest] = useState<ITestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const testId = parseInt(id!);

  useEffect(() => {
    if (testId) {
      fetchTestDetail();
    }
  }, [testId]);

  const fetchTestDetail = async () => {
    setLoading(true);
    try {
      const data = await dataService.getTestDetail(testId);
      setTest(data);
    } catch (error) {
      console.error('Failed to fetch test detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionClick = async (section: ISectionWithParts) => {
    try {
      const attempt = await dataService.startSectionAttempt(user!.id, section.id);
      navigate(`/tests/${id}/sections/${section.id}?attemptId=${attempt.id}&mode=exam`);
    } catch (error) {
      console.error('Failed to start section:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner text={t('common.loading')} />;
  }

  if (!test) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">{t('tests.noTests')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/tests/${id}`)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all hover:-translate-x-1"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Quay lại danh sách</span>
      </button>

      {/* Test Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border-2 border-emerald-200 dark:border-emerald-800">
        <HTMLRenderer
          content={test.title}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
        />
        <div className="flex flex-wrap items-center gap-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {test.level}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {test.year}/{test.month}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {test.sections.length} phần thi
          </span>
        </div>
      </div>

      {/* Section Cards */}
      <SectionList
        sections={test.sections.map(section => ({
          ...section,
          question_count: section.parts.reduce((sum, part) => sum + part.questions.length, 0)
        }))}
        onSectionClick={handleSectionClick}
        mode="detail"
      />
    </div>
  );
};
