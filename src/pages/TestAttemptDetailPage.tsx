/**
 * Test Attempt Detail Page
 * Shows 3 section attempts for a specific test attempt
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book, Headphones, FileText, Clock, CheckCircle, PlayCircle, ArrowLeft } from 'lucide-react';
import { dataService } from '../services';
import type { ITestAttempt } from '../types';
import { HTMLRenderer } from '../components/HTMLRenderer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuthStore } from '../store/useAuthStore';

export function TestAttemptDetailPage() {
  const { testAttemptId } = useParams<{ testAttemptId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [testAttempt, setTestAttempt] = useState<ITestAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (testAttemptId && user) {
      fetchTestAttempt();
    }
  }, [testAttemptId, user]);

  const fetchTestAttempt = async () => {
    setLoading(true);
    try {
      const attempt = await dataService.getTestAttempt(parseInt(testAttemptId!));
      setTestAttempt(attempt);
    } catch (error) {
      console.error('Failed to fetch test attempt:', error);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'PAUSED':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <PlayCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'PAUSED':
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Đã hoàn thành';
      case 'IN_PROGRESS':
        return 'Đang làm';
      case 'PAUSED':
        return 'Tạm dừng';
      default:
        return 'Chưa bắt đầu';
    }
  };

  const handleSectionClick = (section: any) => {
    if (section.status === 'COMPLETED') {
      // Navigate to review mode
      navigate(`/sectionAttempts/${section.id}?mode=review`);
    } else {
      // Resume or continue
      navigate(`/sectionAttempts/${section.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatTimeRemaining = (seconds: number | null) => {
    if (seconds === null || seconds === 0) return null;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return <LoadingSpinner text="Đang tải..." />;
  }

  if (!testAttempt) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Không tìm thấy test attempt</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/tests/${testAttempt.test_id}`)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Quay lại danh sách</span>
      </button>

      {/* Test Attempt Header */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-6 border border-primary-200 dark:border-primary-800">
        <HTMLRenderer
          content={testAttempt.test_title}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
        />
        <div className="flex flex-wrap items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(testAttempt.is_completed ? 'COMPLETED' : 'IN_PROGRESS')}`}>
            {getStatusText(testAttempt.is_completed ? 'COMPLETED' : 'IN_PROGRESS')}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formatDate(testAttempt.started_at)}
          </span>
          {testAttempt.is_completed && testAttempt.total_score !== null && (
            <div className="ml-auto">
              <div className="text-right">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                  {testAttempt.total_score}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Điểm trung bình
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section Attempts */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Các phần thi ({testAttempt.sections.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testAttempt.sections.map((section, index) => (
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
                    {getSectionIcon(section.section_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <HTMLRenderer
                      content={section.section_name}
                      className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2"
                    />
                  </div>
                </div>

                {/* Spacer to push content to bottom */}
                <div className="flex-1" />

                {/* Status - Always at same position */}
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(section.status)}
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {getStatusText(section.status)}
                    </span>
                  </div>
                </div>

                {/* Stats - Always at bottom */}
                <div className="space-y-2 mb-4">
                  {section.status === 'COMPLETED' ? (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Điểm số:</span>
                        <span className="font-bold text-primary-600 dark:text-primary-400">
                          {section.score}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Số câu đúng:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {section.correct_count}/{section.question_count}
                        </span>
                      </div>
                    </>
                  ) : section.status === 'NOT_STARTED' ? (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Thời gian bài thi:</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {section.time_limit} phút
                      </span>
                    </div>
                  ) : (
                    <>
                      {section.time_remaining !== null && section.time_remaining !== undefined && section.time_remaining > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Thời gian còn lại:</span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {formatTimeRemaining(section.time_remaining)}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                    {section.status === 'COMPLETED' ? 'Xem lại' : section.status === 'NOT_STARTED' ? 'Bắt đầu' : 'Tiếp tục'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:bg-primary-600 dark:group-hover:bg-primary-500 transition-all group-hover:scale-110">
                    <span className="text-primary-600 dark:text-primary-400 group-hover:text-white font-bold group-hover:translate-x-0.5 transition-all">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
