/**
 * Test Attempts Page
 * Shows all attempts for a specific test
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, PlayCircle, Calendar, TrendingUp, Award } from 'lucide-react';
import { dataService } from '../services';
import type { ITestAttempt, ITestDetail } from '../types';
import { HTMLRenderer } from '../components/HTMLRenderer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuthStore } from '../store/useAuthStore';

export function TestAttemptsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [test, setTest] = useState<ITestDetail | null>(null);
  const [attempts, setAttempts] = useState<ITestAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      fetchData();
    }
  }, [id, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const testId = parseInt(id!);
      
      // Fetch test detail
      const testData = await dataService.getTestDetail(testId);
      setTest(testData);

      // Fetch test attempts (grouped by test)
      const testAttempts = await dataService.getTestAttempts(user!.id, testId);
      setAttempts(testAttempts);
    } catch (error) {
      console.error('Failed to fetch test attempts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else {
      return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (isCompleted: boolean) => {
    if (isCompleted) {
      return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
    } else {
      return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  const getStatusText = (isCompleted: boolean) => {
    return isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành';
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

  const handleAttemptClick = (attempt: ITestAttempt) => {
    // Navigate to test attempt detail page showing 3 sections
    navigate(`/testAttempts/${attempt.id}`);
  };

  const handleStartNew = () => {
    // Navigate to test detail (sections page) to choose section
    navigate(`/tests/${id}/sections`);
  };

  const getBestScore = () => {
    const completedAttempts = attempts.filter(a => a.is_completed && a.total_score !== null);
    if (completedAttempts.length === 0) return null;
    return Math.max(...completedAttempts.map(a => a.total_score!));
  };

  const getAverageScore = () => {
    const completedAttempts = attempts.filter(a => a.is_completed && a.total_score !== null);
    if (completedAttempts.length === 0) return null;
    const sum = completedAttempts.reduce((acc, a) => acc + a.total_score!, 0);
    return Math.round(sum / completedAttempts.length);
  };

  if (loading) {
    return <LoadingSpinner text="Đang tải..." />;
  }

  if (!test) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Không tìm thấy bài test</p>
      </div>
    );
  }

  const bestScore = getBestScore();
  const avgScore = getAverageScore();
  const completedCount = attempts.filter(a => a.is_completed).length;

  return (
    <div className="space-y-6">
      {/* Only show header and stats if there are attempts */}
      {attempts.length > 0 && (
        <>
          {/* Test Header */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-6 border border-primary-200 dark:border-primary-800">
            <HTMLRenderer
              content={test.title}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
            />
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {test.year}.{String(test.month).padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Level:</span>
                <span className="px-2.5 py-1 bg-primary-600 text-white rounded-full text-xs font-bold">
                  {test.level}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tổng số lần làm</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedCount}</p>
                </div>
              </div>
            </div>

            {bestScore !== null && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Điểm cao nhất</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{bestScore}%</p>
                  </div>
                </div>
              </div>
            )}

            {avgScore !== null && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Điểm trung bình</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{avgScore}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Lịch sử làm bài ({attempts.length})
            </h2>
            <button
              onClick={handleStartNew}
              className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              + Làm bài mới
            </button>
          </div>
        </>
      )}

      {/* Attempts List */}
      {attempts.length === 0 ? (
        <div className="space-y-6">
          {/* Test Introduction */}
          <div className="bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-primary-900/10 dark:via-gray-800 dark:to-primary-900/10 rounded-2xl p-8 border-2 border-primary-200 dark:border-primary-800">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 mb-4 shadow-lg">
                  <PlayCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
                  Chào mừng đến với kỳ thi
                </h2>
                <HTMLRenderer
                  content={test!.title}
                  className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4"
                />
              </div>

              {/* Test Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                    {test!.sections.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Phần thi
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                    {test!.sections.reduce((sum, s) => sum + s.parts.reduce((psum, p) => psum + p.questions.length, 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Câu hỏi
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                    {test!.sections.reduce((sum, s) => sum + s.time_limit, 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Phút
                  </div>
                </div>
              </div>

              {/* Sections List */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Cấu trúc kỳ thi
                </h3>
                <div className="space-y-3">
                  {test!.sections.map((section, index) => (
                    <div key={section.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <HTMLRenderer
                          content={section.name}
                          className="text-sm font-semibold text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {section.parts.reduce((sum, p) => sum + p.questions.length, 0)} câu • {section.time_limit} phút
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <div className="text-center">
                <button
                  onClick={handleStartNew}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <PlayCircle className="w-6 h-6" />
                  Bắt đầu làm bài ngay
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Bạn có thể tạm dừng và tiếp tục làm bài bất kỳ lúc nào
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts.map((attempt) => (
            <div
              key={attempt.id}
              className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleAttemptClick(attempt)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(attempt.is_completed)}
                    <span 
                      className="font-semibold text-gray-900 dark:text-white"
                      dangerouslySetInnerHTML={{ __html: attempt.test_title }}
                    />
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(attempt.is_completed)}`}>
                      {getStatusText(attempt.is_completed)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(attempt.started_at)}</span>
                    </div>
                    {attempt.is_completed && attempt.completed_at && (
                      <>
                        <span>•</span>
                        <span>
                          Hoàn thành: {formatDate(attempt.completed_at)}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>3 sections</span>
                    <span>•</span>
                    <span>
                      {attempt.sections.filter(s => s.status === 'COMPLETED').length} hoàn thành
                    </span>
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
          ))}
        </div>
      )}
    </div>
  );
}
