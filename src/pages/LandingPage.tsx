/**
 * Landing/Intro Page
 * Clean and elegant landing page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, TrendingUp, Award, ArrowRight, Moon, Sun, Globe } from 'lucide-react';
import { AuthLayout } from '../layouts/AuthLayout';
import { AuthModal } from '../components/AuthModal';
import { useAuthStore } from '../store/useAuthStore';

export function LandingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, token, navigate]);

  // Handle theme toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleStart = () => {
    if (isAuthenticated && token) {
      navigate('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigate('/dashboard');
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setShowLangMenu(false);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  ];

  return (
    <AuthLayout>
      <div className="h-screen w-full overflow-hidden relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        
        {/* Top Bar - Theme & Language */}
        <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                      i18n.language === lang.code ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {lang.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="h-full flex items-center justify-center px-6">
          <div className="max-w-6xl w-full">
            
            {/* Hero Section */}
            <div className="text-center space-y-8 mb-12">
              
              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-8xl font-black text-gray-900 dark:text-white">
                  {t('landing.title')}
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {t('landing.subtitle')}
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleStart}
                  className="group px-10 py-5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                >
                  {t('landing.start')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                {/* JLPT Levels */}
                <div className="flex items-center gap-2">
                  {['N5', 'N4', 'N3', 'N2', 'N1'].map((level) => (
                    <div
                      key={level}
                      className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-md text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform"
                    >
                      {level}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Features - Clean Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              
              {/* Feature 1 */}
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('landing.features.practice')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('landing.features.practiceDesc')}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('landing.features.tracking')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('landing.features.trackingDesc')}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                  <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('landing.features.feedback')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('landing.features.feedbackDesc')}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-12 mt-12">
        
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-500">
          © 2025 JLPT Practice
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </AuthLayout>
  );
}
