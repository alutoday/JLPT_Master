/**
 * Main App Component with Router
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { TestDetailPage } from './pages/TestDetailPage';
import { TestAttemptsPage } from './pages/TestAttemptsPage';
import { TestAttemptDetailPage } from './pages/TestAttemptDetailPage';
import { ExamPage } from './pages/ExamPage';
import { HistoryPage, ProfilePage, SettingsPage } from './pages/PlaceholderPages';
import { ProtectedRoute } from './components/ProtectedRoute';
import './i18n/config'; // Initialize i18next

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Routes with MainLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />       

        <Route
          path="/tests/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TestAttemptsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tests/:id/sections"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TestDetailPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/testAttempts/:testAttemptId" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <TestAttemptDetailPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Exam Route - No MainLayout, uses ExamLayout internally */}
        <Route
          path="/sectionAttempts/:sectionAttemptId"  
          element={
            <ProtectedRoute>
              <ExamPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <MainLayout>
                <HistoryPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
