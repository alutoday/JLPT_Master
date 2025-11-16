/**
 * API Data Service Implementation
 * Handles real API calls using Axios
 */

import axios, { type AxiosInstance, type AxiosError } from 'axios';
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
import type { IDataService } from './IDataService';

export class ApiDataService implements IDataService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api') {
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  // ============================================================================
  // Test Management
  // ============================================================================

  async getTests(filter?: TestFilter): Promise<ITest[]> {
    const params = new URLSearchParams();

    if (filter?.level) params.append('level', filter.level);
    if (filter?.year) params.append('year', filter.year.toString());
    if (filter?.is_active !== undefined) params.append('is_active', filter.is_active.toString());

    const response = await this.api.get<ITest[]>('/tests', { params });
    return response.data;
  }

  async getTestDetail(id: number): Promise<ITestDetail> {
    const response = await this.api.get<ITestDetail>(`/tests/${id}`);
    return response.data;
  }

  // ============================================================================
  // Test Attempt Management
  // ============================================================================

  async startTestAttempt(userId: number, testId: number): Promise<ITestAttempt> {
    const response = await this.api.post<ITestAttempt>('/test-attempts', {
      user_id: userId,
      test_id: testId,
    });
    return response.data;
  }

  async getTestAttempt(testAttemptId: number): Promise<ITestAttempt> {
    const response = await this.api.get<ITestAttempt>(`/test-attempts/${testAttemptId}`);
    return response.data;
  }

  // ============================================================================
  // Section Attempt Management
  // ============================================================================

  async startSectionAttempt(testAttemptId: number, sectionId: number): Promise<ISectionAttempt> {
    const response = await this.api.post<ISectionAttempt>('/section-attempts', {
      test_attempt_id: testAttemptId,
      section_id: sectionId,
    });
    return response.data;
  }

  async getSectionAttempt(attemptId: number): Promise<ISectionAttempt> {
    const response = await this.api.get<ISectionAttempt>(`/section-attempts/${attemptId}`);
    return response.data;
  }

  async resumeSectionAttempt(attemptId: number): Promise<ISectionAttempt> {
    const response = await this.api.patch<ISectionAttempt>(`/section-attempts/${attemptId}/resume`);
    return response.data;
  }

  async saveProgress(attemptId: number, timeRemaining: number): Promise<ISectionAttempt> {
    const response = await this.api.patch<ISectionAttempt>(`/section-attempts/${attemptId}/progress`, {
      time_remaining: timeRemaining,
    });
    return response.data;
  }

  async submitAttempt(data: ISubmission): Promise<IResult> {
    const response = await this.api.post<IResult>(
      `/section-attempts/${data.section_attempt_id}/submit`,
      data
    );
    return response.data;
  }

  // ============================================================================
  // User History
  // ============================================================================

  async getHistory(userId: number): Promise<ITestAttempt[]> {
    return this.getTestAttempts(userId);
  }

  async getTestAttempts(userId: number, testId?: number): Promise<ITestAttempt[]> {
    const params = new URLSearchParams();
    if (testId) params.append('test_id', testId.toString());
    
    const response = await this.api.get<ITestAttempt[]>(`/users/${userId}/test-attempts`, { params });
    return response.data;
  }

  async getAttemptResult(attemptId: number): Promise<IResult> {
    const response = await this.api.get<IResult>(`/section-attempts/${attemptId}/result`);
    return response.data;
  }

  // ============================================================================
  // Authentication
  // ============================================================================

  async login(credentials: ILoginCredentials): Promise<IAuthResponse> {
    const response = await this.api.post<IAuthResponse>('/auth/login', credentials);
    this.setToken(response.data.token);
    return response.data;
  }

  async register(data: IRegisterData): Promise<IAuthResponse> {
    const response = await this.api.post<IAuthResponse>('/auth/register', data);
    this.setToken(response.data.token);
    return response.data;
  }

  async getCurrentUser(): Promise<IUser> {
    const response = await this.api.get<IUser>('/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } finally {
      this.clearToken();
    }
  }

  // ============================================================================
  // Token Management
  // ============================================================================

  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem('jlpt_auth_token', token);
  }

  private getStoredToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('jlpt_auth_token');
    }
    return this.token;
  }

  private clearToken(): void {
    this.token = null;
    localStorage.removeItem('jlpt_auth_token');
  }

  // ============================================================================
  // Error Handling
  // ============================================================================

  private handleError(error: AxiosError): Error {
    if (error.response) {
      // Server responded with error status
      const message = (error.response.data as any)?.message || error.message;
      return new Error(`API Error: ${message}`);
    } else if (error.request) {
      // Request made but no response
      return new Error('Network Error: No response from server');
    } else {
      // Something else happened
      return new Error(`Request Error: ${error.message}`);
    }
  }
}
