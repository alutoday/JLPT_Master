/**
 * Data Service Interface
 * Defines the contract for data fetching operations
 * Can be implemented by MockDataService or ApiDataService
 */

import type {
  ITest,
  ITestDetail,
  TestFilter,
  ISubmission,
  IResult,
  ITestAttempt,
  IAuthResponse,
  ILoginCredentials,
  IRegisterData,
  IUser,
  ISectionAttempt,
} from '../types';

export interface IDataService {
  // ============================================================================
  // Test Management
  // ============================================================================

  /**
   * Get list of tests with optional filtering
   * @param filter - Optional filter criteria (level, year, is_active)
   * @returns Promise resolving to array of tests
   */
  getTests(filter?: TestFilter): Promise<ITest[]>;

  /**
   * Get detailed test information including all sections, parts, questions, and options
   * @param id - Test ID
   * @returns Promise resolving to test detail with nested structure
   */
  getTestDetail(id: number): Promise<ITestDetail>;

  // ============================================================================
  // Test Attempt Management (Parent)
  // ============================================================================

  /**
   * Start a new test attempt (creates parent record)
   * @param userId - User ID
   * @param testId - Test ID
   * @returns Promise resolving to created test attempt
   */
  startTestAttempt(userId: number, testId: number): Promise<ITestAttempt>;

  /**
   * Get test attempt by ID (with all section attempts)
   * @param testAttemptId - Test attempt ID
   * @returns Promise resolving to test attempt with sections
   */
  getTestAttempt(testAttemptId: number): Promise<ITestAttempt>;

  /**
   * Get all test attempts for a user (optionally filtered by test)
   * @param userId - User ID
   * @param testId - Optional test ID filter
   * @returns Promise resolving to array of test attempts
   */
  getTestAttempts(userId: number, testId?: number): Promise<ITestAttempt[]>;

  // ============================================================================
  // Section Attempt Management (Child)
  // ============================================================================

  /**
   * Start a new section attempt (requires test_attempt_id)
   * @param testAttemptId - Parent test attempt ID
   * @param sectionId - Section ID
   * @returns Promise resolving to created section attempt
   */
  startSectionAttempt(testAttemptId: number, sectionId: number): Promise<ISectionAttempt>;

  /**
   * Resume a paused section attempt
   * @param attemptId - Section attempt ID
   * @returns Promise resolving to resumed section attempt with current state
   */
  resumeSectionAttempt(attemptId: number): Promise<ISectionAttempt>;

  /**
   * Get section attempt by ID
   * @param attemptId - Section attempt ID
   * @returns Promise resolving to section attempt
   */
  getSectionAttempt(attemptId: number): Promise<ISectionAttempt>;

  /**
   * Save progress during attempt (auto-save functionality)
   * @param attemptId - Section attempt ID
   * @param timeRemaining - Remaining time in seconds
   * @returns Promise resolving to updated section attempt
   */
  saveProgress(attemptId: number, timeRemaining: number): Promise<ISectionAttempt>;

  /**
   * Submit answers for a section attempt
   * @param data - Submission data including answers and time remaining
   * @returns Promise resolving to result with score and detailed feedback
   */
  submitAttempt(data: ISubmission): Promise<IResult>;

  // ============================================================================
  // User History
  // ============================================================================

  /**
   * Get user's section attempt history
   * @param userId - User ID
   * @returns Promise resolving to array of section attempts
   */
  getHistory(userId: number): Promise<ITestAttempt[]>;

  /**
   * Get user's test attempt history (grouped by test)
   * @param userId - User ID
   * @param testId - Optional test ID to filter
   * @returns Promise resolving to array of test attempts
   */
  getTestAttempts(userId: number, testId?: number): Promise<ITestAttempt[]>;

  /**
   * Get detailed result for a specific attempt
   * @param attemptId - Section attempt ID
   * @returns Promise resolving to detailed result
   */
  getAttemptResult(attemptId: number): Promise<IResult>;

  // ============================================================================
  // Authentication (Optional - for API implementation)
  // ============================================================================

  /**
   * Login user
   * @param credentials - Email and password
   * @returns Promise resolving to authentication response with token and user
   */
  login(credentials: ILoginCredentials): Promise<IAuthResponse>;

  /**
   * Register new user
   * @param data - Registration data
   * @returns Promise resolving to authentication response with token and user
   */
  register(data: IRegisterData): Promise<IAuthResponse>;

  /**
   * Get current user profile
   * @returns Promise resolving to user data
   */
  getCurrentUser(): Promise<IUser>;

  /**
   * Logout current user
   * @returns Promise resolving when logout is complete
   */
  logout(): Promise<void>;
}
