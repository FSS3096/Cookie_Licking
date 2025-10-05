import axios, { AxiosError, AxiosInstance } from 'axios';
import { AuthResponse, ApiError } from '@/types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle token expiration
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management
  setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.api.defaults.headers.common['Authorization'];
  }

  // Generic HTTP methods
  async get<T = any>(url: string) {
    try {
      const response = await this.api.get<T>(url);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T = any>(url: string, data: any) {
    try {
      const response = await this.api.post<T>(url, data);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T = any>(url: string, data: any) {
    try {
      const response = await this.api.put<T>(url, data);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T = any>(url: string) {
    try {
      const response = await this.api.delete<T>(url);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async handleGitHubCallback(token: string): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/github/verify', {
        token,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Helper method to handle API errors
  private handleError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      return {
        message:
          error.response?.data?.message ||
          error.message ||
          'An error occurred',
        error: error.response?.data,
      };
    }
    return {
      message: error.message || 'An unknown error occurred',
      error,
    };
  }
}

export const apiService = new ApiService();