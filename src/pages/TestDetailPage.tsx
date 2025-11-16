/**
 * TestDetailPage Component
 * Section selection page with Start/Resume/Review buttons
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Book, Headphones, FileText, ArrowLeft } from 'lucide-react';
import { dataService } from '../services';
import type { ITestDetail, ISectionWithParts } from '../types';
import { HTMLRenderer } from '../components/HTMLRenderer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuthStore } from '../store/useAuthStore';

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

  const getSectionIcon = (sectionName: string) => {
    if (sectionName.includes('言語知識') || sectionName.includes('Language')) {
      return <Book className="w-6 h-6" />;
    }
    if (sectionName.includes('聴解') || sectionName.includes('Listening')) {
      return <Headphones className="w-6 h-6" />;
    }
    return <FileText className="w-6 h-6" />;
  };

  const getSectionGradient = (index: number) => {
    const gradients = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-orange-500 to-red-500',
    ];
    return gradients[index % gradients.length];
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
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Quay lại danh sách</span>
      </button>

      {/* Test Header */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-6 border border-primary-200 dark:border-primary-800">
        <HTMLRenderer
          content={test.title}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
        />
        <div className="flex flex-wrap items-center gap-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
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
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Chọn phần thi để bắt đầu ({test.sections.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {test.sections.map((section, index) => {
            const totalQuestions = section.parts.reduce((sum, part) => sum + part.questions.length, 0);

            return (
              <div
                key={section.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer hover:-translate-y-1 flex flex-col"
                onClick={() => handleSectionClick(section)}
              >
                {/* Gradient Top Bar */}
                <div className={`h-1.5 bg-gradient-to-r ${getSectionGradient(index)}`} />

                <div className="p-5 flex flex-col flex-1">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-3 mb-4 min-h-[64px]">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getSectionGradient(index)} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                      {getSectionIcon(section.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <HTMLRenderer
                        content={section.name}
                        className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2"
                      />
                    </div>
                  </div>

                  {/* Spacer to push content to bottom */}
                  <div className="flex-1" />

                  {/* Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Số câu hỏi:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {totalQuestions}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Thời gian:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {section.time_limit} phút
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                      Bắt đầu ngay
                    </span>
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:bg-primary-600 dark:group-hover:bg-primary-500 transition-all group-hover:scale-110">
                      <span className="text-primary-600 dark:text-primary-400 group-hover:text-white font-bold group-hover:translate-x-0.5 transition-all">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
