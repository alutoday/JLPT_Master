/**
 * ExamPage Component
 * Main exam interface with questions, options, and review mode
 */

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, X, Flag, AlertCircle } from 'lucide-react';
import { dataService } from '../services';
import { useExamStore } from '../store/useExamStore';
import { useAuthStore } from '../store/useAuthStore';
import type { ISectionWithParts, IQuestionWithOptions, IResult } from '../types';
import { ExamLayout } from '../layouts/ExamLayout';
import { HTMLRenderer } from '../components/HTMLRenderer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AudioPlayer } from '../components/AudioPlayer';

export const ExamPage: React.FC = () => {
  const { sectionAttemptId } = useParams<{ sectionAttemptId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { initExam, setAnswer, toggleMark, answers, mode } = useExamStore();

  const [section, setSection] = useState<ISectionWithParts | null>(null);
  const [result, setResult] = useState<IResult | null>(null);
  const [loading, setLoading] = useState(true);

  const examMode = searchParams.get('mode') as 'exam' | 'review' || 'exam';

  useEffect(() => {
    if (sectionAttemptId && user) {
      loadSection();
    }
  }, [sectionAttemptId, user]);

  const loadSection = async () => {
    setLoading(true);
    try {
      const currentSectionAttemptId = parseInt(sectionAttemptId!);
      
      // Get section_attempt to find section_id
      const sectionAttempt = await dataService.getSectionAttempt(currentSectionAttemptId);
      
      // Get section data from test_attempt -> test -> sections
      const testAttempt = await dataService.getTestAttempt(sectionAttempt.test_attempt_id);
      const testDetail = await dataService.getTestDetail(testAttempt.test_id);
      const sectionData = testDetail.sections.find(s => s.id === sectionAttempt.section_id);

      if (!sectionData) {
        throw new Error('Section not found');
      }

      setSection(sectionData);

      if (examMode === 'exam') {
        // Resume attempt
        initExam(
          currentSectionAttemptId,
          sectionData.id,
          'exam',
          sectionAttempt.time_remaining || sectionData.time_limit * 60
        );
      } else {
        // Review mode - load results
        const resultData = await dataService.getAttemptResult(currentSectionAttemptId);
        setResult(resultData);
        initExam(currentSectionAttemptId, sectionData.id, 'review', 0);
        
        // Load answers into store for display
        resultData.questions.forEach(q => {
          if (q.selected_option_id !== null) {
            setAnswer(q.question_id, q.selected_option_id);
          }
          if (q.is_marked) {
            toggleMark(q.question_id);
          }
        });
      }
    } catch (error) {
      console.error('Failed to load section:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!sectionAttemptId || !section) return;

    try {
      const answerList = Array.from(answers.values()).map(answer => ({
        question_id: answer.questionId,
        selected_option_id: answer.selectedOptionId,
        is_marked: answer.isMarked,
      }));

      const submission = {
        section_attempt_id: parseInt(sectionAttemptId!),
        answers: answerList,
        time_remaining: useExamStore.getState().timeRemaining,
      };

      const resultData = await dataService.submitAttempt(submission);
      setResult(resultData);
      
      // Switch to review mode
      navigate(`/sectionAttempts/${sectionAttemptId}?mode=review`);
      window.location.reload(); // Force reload to switch mode
    } catch (error) {
      console.error('Failed to submit exam:', error);
    }
  };

  const handleOptionSelect = (questionId: number, optionId: number) => {
    if (mode === 'exam') {
      setAnswer(questionId, optionId);
    }
  };

  const handleToggleMark = (questionId: number) => {
    if (mode === 'exam') {
      toggleMark(questionId);
    }
  };

  const isOptionSelected = (questionId: number, optionId: number): boolean => {
    return answers.get(questionId)?.selectedOptionId === optionId;
  };

  const isQuestionMarked = (questionId: number): boolean => {
    return answers.get(questionId)?.isMarked || false;
  };

  const getOptionStyle = (questionId: number, optionId: number, isCorrect: boolean): string => {
    if (mode === 'exam') {
      // Exam mode - just highlight selected
      return isOptionSelected(questionId, optionId)
        ? 'border-primary bg-primary/10'
        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500';
    }

    // Review mode - show correct/wrong
    const userSelected = isOptionSelected(questionId, optionId);
    
    if (userSelected && isCorrect) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/20'; // User correct
    }
    if (userSelected && !isCorrect) {
      return 'border-red-500 bg-red-50 dark:bg-red-900/20'; // User wrong
    }
    if (!userSelected && isCorrect) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/20'; // Correct answer
    }
    return 'border-gray-300 dark:border-gray-600';
  };

  const getQuestionResult = (questionId: number) => {
    if (!result) return null;
    return result.questions.find(q => q.question_id === questionId);
  };

  const renderQuestion = (question: IQuestionWithOptions, questionIndex: number) => {
    const questionResult = getQuestionResult(question.id);
    const isCorrect = questionResult?.is_correct || false;

    return (
      <div
        key={question.id}
        id={`question-${questionIndex + 1}`}
        className="mb-10 scroll-mt-20"
      >
        {/* Question Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                問 {questionIndex + 1}
              </span>
              {mode === 'review' && (
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                  isCorrect 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                  {isCorrect ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      正解
                    </>
                  ) : (
                    <>
                      <X className="w-3.5 h-3.5" />
                      不正解
                    </>
                  )}
                </span>
              )}
            </div>
            
            {/* Audio Player for Listening Questions */}
            {question.audio_url && (
              <AudioPlayer audioUrl={question.audio_url} questionNumber={questionIndex + 1} />
            )}
            
            <HTMLRenderer
              content={question.content}
              className="text-[15px] leading-relaxed text-gray-900 dark:text-white mb-1"
            />
          </div>
          {mode === 'exam' && (
            <button
              onClick={() => handleToggleMark(question.id)}
              className={`p-2 rounded-lg transition-colors ${
                isQuestionMarked(question.id)
                  ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              title={t('exam.markForReview')}
            >
              <Flag className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Question Image */}
        {question.image_url && (
          <div className="mb-4">
            <img
              src={question.image_url}
              alt={`Question ${questionIndex + 1}`}
              className="max-w-full h-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-md"
            />
          </div>
        )}

        {/* Options */}
        {(() => {
          // Calculate max option length to determine optimal grid layout
          const maxLength = Math.max(...question.options.map(opt => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = opt.content;
            return tempDiv.textContent?.length || 0;
          }));
          
          // Determine grid columns: short options (≤15 chars) = 4 cols, medium (≤40 chars) = 2 cols, long = 1 col
          const gridCols = maxLength <= 15 ? 'sm:grid-cols-4' : maxLength <= 40 ? 'sm:grid-cols-2' : 'grid-cols-1';
          
          return (
            <div className={`grid ${gridCols} gap-3 mt-4`}>
              {question.options.map((option) => {
                const optionStyle = getOptionStyle(question.id, option.id, option.is_correct);
                const isSelected = isOptionSelected(question.id, option.id);
                const isCorrectAnswer = mode === 'review' && option.is_correct;
                const isWrongSelection = mode === 'review' && isSelected && !option.is_correct;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(question.id, option.id)}
                    disabled={mode === 'review'}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all ${optionStyle} ${
                      mode === 'review' ? 'cursor-default' : 'cursor-pointer hover:shadow-md'
                    } ${isSelected && mode === 'exam' ? 'ring-2 ring-primary-300 dark:ring-primary-700' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`w-7 h-7 flex items-center justify-center rounded-lg font-bold text-xs flex-shrink-0 ${
                          isSelected && mode === 'exam'
                            ? 'bg-primary-600 text-white'
                            : isCorrectAnswer
                            ? 'bg-green-600 text-white'
                            : isWrongSelection
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {option.order_index}
                        </span>
                        <div className="flex-1">
                          <HTMLRenderer
                            content={option.content}
                            className="text-[15px] leading-relaxed text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                      {isCorrectAnswer && (
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      )}
                      {isWrongSelection && (
                        <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
              );
            })}
            </div>
          );
        })()}

        {/* Explanation (Review Mode Only) */}
        {mode === 'review' && question.explanation && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-1.5 text-sm">
                  解説
                </h4>
                <HTMLRenderer
                  content={question.explanation}
                  className="text-[14px] leading-relaxed text-blue-800 dark:text-blue-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text={t('common.loading')} />
      </div>
    );
  }

  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">{t('exam.sectionNotFound')}</p>
      </div>
    );
  }

  // Count total questions
  const totalQuestions = section.parts.reduce((sum, part) => sum + part.questions.length, 0);
  const questionIds = section.parts.flatMap(part => part.questions.map(q => q.id));
  let questionIndex = 0;

  return (
    <ExamLayout
      totalQuestions={totalQuestions}
      questionIds={questionIds}
      hasAudio={!!section.audio_url}
      audioUrl={section.audio_url}
      onSubmit={handleSubmit}
      correctCount={result?.correct_count}
      resultQuestions={result?.questions}
    >
      <div className="space-y-10 py-4">
        {section.parts.map((part) => (
          <div key={part.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            {/* Part Title */}
            <div className="mb-6 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
              <HTMLRenderer
                content={part.title}
                className="text-lg font-bold text-gray-900 dark:text-white leading-relaxed"
              />
            </div>

            {/* Passage (if exists) */}
            {part.passage && (
              <div className="mb-6 p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border-l-4 border-amber-400 dark:border-amber-600">
                {part.passage.title && (
                  <HTMLRenderer
                    content={part.passage.title}
                    className="text-base font-bold text-gray-900 dark:text-white mb-3"
                  />
                )}
                <HTMLRenderer
                  content={part.passage.content}
                  className="text-[15px] leading-[1.7] text-gray-800 dark:text-gray-200"
                />
                {part.passage.image_url && (
                  <img
                    src={part.passage.image_url}
                    alt={part.passage.title || 'Passage image'}
                    className="mt-4 w-full h-auto rounded-xl shadow-md"
                  />
                )}
              </div>
            )}

            {/* Questions */}
            <div>
              {part.questions.map((question) => {
                const rendered = renderQuestion(question, questionIndex);
                questionIndex++;
                return rendered;
              })}
            </div>
          </div>
        ))}
      </div>
    </ExamLayout>
  );
};
