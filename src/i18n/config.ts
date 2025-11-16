/**
 * i18next Configuration
 * Supports English (EN), Japanese (JP), and Vietnamese (VI)
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      common: {
        welcome: 'Welcome',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        back: 'Back',
        next: 'Next',
        submit: 'Submit',
        close: 'Close',
        completed: 'Completed',
      },
      
      // Auth
      auth: {
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        fullName: 'Full Name',
        confirmPassword: 'Confirm Password',
        forgotPassword: 'Forgot Password?',
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: 'Already have an account?',
        resetPassword: 'Reset Password',
        sendResetLink: 'Send Reset Link',
        backToLogin: 'Back to Login',
      },
      
      // Landing
      landing: {
        title: 'JLPT Practice',
        subtitle: 'Master Japanese Language Proficiency Test',
        description: 'Practice JLPT tests with realistic questions, instant feedback, and progress tracking.',
        start: 'Start Now',
        features: {
          practice: 'Practice Tests',
          practiceDesc: 'Full-length JLPT tests for all levels',
          tracking: 'Progress Tracking',
          trackingDesc: 'Monitor your improvement over time',
          feedback: 'Instant Feedback',
          feedbackDesc: 'Get detailed explanations for every answer',
        },
      },
      
      // Navigation
      nav: {
        dashboard: 'Dashboard',
        tests: 'Tests',
        history: 'History',
        profile: 'Profile',
        settings: 'Settings',
      },
      
      // Settings
      settings: {
        darkMode: 'Dark Mode',
        language: 'Language',
        theme: 'Theme',
      },
      
      // Dashboard
      dashboard: {
        weeklyActivity: 'Weekly Activity',
        recentAttempts: 'Recent Attempts',
        noAttempts: 'No recent attempts',
        viewAll: 'View All',
      },
      
      // Tests
      tests: {
        title: 'Practice Tests',
        subtitle: 'Choose a test to start practicing',
        level: 'Level',
        year: 'Year',
        month: 'Month',
        sections: 'Sections',
        startTest: 'Start Test',
        continueTest: 'Continue Test',
        noTests: 'No tests available',
        filters: {
          level: 'Level',
          year: 'Year',
          allLevels: 'All Levels',
          allYears: 'All Years',
        },
        status: {
          new: 'New',
          inProgress: 'In Progress',
          completed: 'Completed',
        },
        actions: {
          start: 'Start Test',
          continue: 'Continue',
          review: 'Review',
        },
        highScore: 'High Score',
        timeLimit: 'Time Limit',
        audioRequired: 'Audio Required',
      },

      // Exam
      exam: {
        title: 'Exam',
        reviewTitle: 'Review',
        questions: 'Questions',
        submit: 'Submit Exam',
        exit: 'Exit',
        audioPlayer: 'Audio Player',
        results: 'Results',
        score: 'Score',
        correct: 'Correct',
        incorrect: 'Incorrect',
        explanation: 'Explanation',
        markForReview: 'Mark for Review',
        sectionNotFound: 'Section not found',
        submitConfirmTitle: 'Submit Exam?',
        submitConfirmMessage: 'Are you sure you want to submit? You cannot change your answers after submission.',
        exitConfirmTitle: 'Exit Exam?',
        exitConfirmMessage: 'Your progress will be lost if you exit without submitting.',
        legend: {
          unanswered: 'Unanswered',
          answered: 'Answered',
          marked: 'Marked for Review',
          correct: 'Correct',
          wrong: 'Wrong',
          skipped: 'Skipped',
        },
      },
    },
  },
  
  ja: {
    translation: {
      common: {
        welcome: 'ようこそ',
        loading: '読み込み中...',
        error: 'エラー',
        success: '成功',
        cancel: 'キャンセル',
        confirm: '確認',
        save: '保存',
        delete: '削除',
        edit: '編集',
        back: '戻る',
        next: '次へ',
        submit: '送信',
        close: '閉じる',
      },
      
      auth: {
        login: 'ログイン',
        register: '新規登録',
        logout: 'ログアウト',
        email: 'メールアドレス',
        password: 'パスワード',
        fullName: '氏名',
        confirmPassword: 'パスワード確認',
        forgotPassword: 'パスワードをお忘れですか？',
        dontHaveAccount: 'アカウントをお持ちでないですか？',
        alreadyHaveAccount: '既にアカウントをお持ちですか？',
        resetPassword: 'パスワードリセット',
        sendResetLink: 'リセットリンクを送信',
        backToLogin: 'ログインに戻る',
      },
      
      landing: {
        title: 'JLPT練習',
        subtitle: '日本語能力試験をマスターしよう',
        description: '実際の問題で練習し、即座のフィードバックと進捗追跡で上達しましょう。',
        start: '今すぐ始める',
        features: {
          practice: '練習テスト',
          practiceDesc: '全レベルの完全なJLPTテスト',
          tracking: '進捗追跡',
          trackingDesc: '時間をかけて上達を確認',
          feedback: '即座のフィードバック',
          feedbackDesc: 'すべての解答に詳しい説明',
        },
      },
      
      nav: {
        dashboard: 'ダッシュボード',
        tests: 'テスト',
        history: '履歴',
        profile: 'プロフィール',
        settings: '設定',
      },
      
      settings: {
        darkMode: 'ダークモード',
        language: '言語',
        theme: 'テーマ',
      },
      
      dashboard: {
        weeklyActivity: '週間活動',
        recentAttempts: '最近の受験',
        noAttempts: '最近の受験はありません',
        viewAll: 'すべて表示',
      },
      
      tests: {
        title: '練習テスト',
        subtitle: 'テストを選んで練習を開始',
        level: 'レベル',
        year: '年',
        month: '月',
        sections: 'セクション',
        startTest: 'テスト開始',
        continueTest: 'テスト続行',
        noTests: 'テストがありません',
        filters: {
          level: 'レベル',
          year: '年',
          allLevels: '全レベル',
          allYears: '全年',
        },
        status: {
          new: '新規',
          inProgress: '進行中',
          completed: '完了',
        },
        actions: {
          start: 'テスト開始',
          continue: '続ける',
          review: '復習',
        },
        highScore: '最高得点',
        timeLimit: '制限時間',
        audioRequired: '音声必要',
      },
    },
  },
  
  vi: {
    translation: {
      common: {
        welcome: 'Chào mừng',
        loading: 'Đang tải...',
        error: 'Lỗi',
        success: 'Thành công',
        cancel: 'Hủy',
        confirm: 'Xác nhận',
        save: 'Lưu',
        delete: 'Xóa',
        edit: 'Chỉnh sửa',
        back: 'Quay lại',
        next: 'Tiếp theo',
        submit: 'Gửi',
        close: 'Đóng',
      },
      
      auth: {
        login: 'Đăng nhập',
        register: 'Đăng ký',
        logout: 'Đăng xuất',
        email: 'Email',
        password: 'Mật khẩu',
        fullName: 'Họ và tên',
        confirmPassword: 'Xác nhận mật khẩu',
        forgotPassword: 'Quên mật khẩu?',
        dontHaveAccount: 'Chưa có tài khoản?',
        alreadyHaveAccount: 'Đã có tài khoản?',
        resetPassword: 'Đặt lại mật khẩu',
        sendResetLink: 'Gửi liên kết đặt lại',
        backToLogin: 'Quay lại đăng nhập',
      },
      
      landing: {
        title: 'Luyện thi JLPT',
        subtitle: 'Làm chủ kỳ thi năng lực tiếng Nhật',
        description: 'Luyện tập với các đề thi JLPT thực tế, nhận phản hồi ngay lập tức và theo dõi tiến độ.',
        start: 'Bắt đầu ngay',
        features: {
          practice: 'Đề thi luyện tập',
          practiceDesc: 'Đề thi JLPT đầy đủ cho mọi cấp độ',
          tracking: 'Theo dõi tiến độ',
          trackingDesc: 'Giám sát sự tiến bộ của bạn theo thời gian',
          feedback: 'Phản hồi ngay lập tức',
          feedbackDesc: 'Giải thích chi tiết cho mọi câu trả lời',
        },
      },
      
      nav: {
        dashboard: 'Bảng điều khiển',
        tests: 'Bài kiểm tra',
        history: 'Lịch sử',
        profile: 'Hồ sơ',
        settings: 'Cài đặt',
      },
      
      settings: {
        darkMode: 'Chế độ tối',
        language: 'Ngôn ngữ',
        theme: 'Giao diện',
      },
      
      dashboard: {
        weeklyActivity: 'Hoạt động tuần',
        recentAttempts: 'Lần thi gần đây',
        noAttempts: 'Không có lần thi nào gần đây',
        viewAll: 'Xem tất cả',
      },
      
      tests: {
        level: 'Cấp độ',
        year: 'Năm',
        month: 'Tháng',
        sections: 'Phần thi',
        startTest: 'Bắt đầu thi',
        continueTest: 'Tiếp tục thi',
      },
    },
  },
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('jlpt-language') || 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

// Save language preference on change
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('jlpt-language', lng);
});

export default i18n;
