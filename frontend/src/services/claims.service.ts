import { Claim, ApiError } from '@/types';
import { apiService } from './api.service';

class ClaimsService {
  private api = apiService;

  async getMyClaims(): Promise<Claim[]> {
    try {
      const response = await this.api.get<Claim[]>('/claims/my-claims');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createClaim(repository: any, issue: any): Promise<Claim> {
    try {
      const response = await this.api.post<Claim>('/claims', {
        repository,
        issue,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateClaimStatus(
    claimId: string,
    status: string,
    notes?: string
  ): Promise<Claim> {
    try {
      const response = await this.api.put<Claim>(
        `/claims/${claimId}/status`,
        {
          status,
          notes,
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async sendNudge(claimId: string): Promise<Claim> {
    try {
      const response = await this.api.post<Claim>(
        `/claims/${claimId}/nudge`, {}
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRepositoryClaims(owner: string, name: string): Promise<Claim[]> {
    try {
      const response = await this.api.get<Claim[]>(
        `/claims/repo/${owner}/${name}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    if (error instanceof Error) {
      return {
        message: error.message,
        error,
      };
    }
    return {
      message: 'An unknown error occurred',
      error,
    };
  }
}

export const claimsService = new ClaimsService();