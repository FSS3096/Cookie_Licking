import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api.service';

interface Claim {
  _id: string;
  repository: {
    owner: string;
    name: string;
    url: string;
  };
  issue: {
    number: number;
    title: string;
    url: string;
  };
  claimedBy: {
    _id: string;
    name: string;
    email: string;
    githubUsername?: string;
  };
  status: 'active' | 'completed' | 'abandoned' | 'released';
  lastActivityDate: string;
  nudgeCount: number;
  lastNudgeDate?: string;
  releaseDate?: string;
  notes?: string;
  createdAt: string;
}

interface DashboardContextType {
  claims: Claim[];
  loading: boolean;
  error: string | null;
  createClaim: (repository: any, issue: any) => Promise<void>;
  updateClaimStatus: (claimId: string, status: string, notes?: string) => Promise<void>;
  sendNudge: (claimId: string) => Promise<void>;
  refreshClaims: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = async () => {
    try {
      const response = await apiService.get<Claim[]>('/claims/my-claims');
      setClaims(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch claims');
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const createClaim = async (repository: any, issue: any) => {
    try {
      const response = await apiService.post<Claim>('/claims', { repository, issue });
      setClaims(prevClaims => [...prevClaims, response.data]);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create claim');
    }
  };

  const updateClaimStatus = async (claimId: string, status: string, notes?: string) => {
    try {
      const response = await apiService.put<Claim>(`/claims/${claimId}/status`, { status, notes });
      setClaims(prevClaims =>
        prevClaims.map(claim =>
          claim._id === claimId ? response.data : claim
        )
      );
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update claim');
    }
  };

  const sendNudge = async (claimId: string) => {
    try {
      const response = await apiService.post<Claim>(`/claims/${claimId}/nudge`, {});
      setClaims(prevClaims =>
        prevClaims.map(claim =>
          claim._id === claimId ? response.data : claim
        )
      );
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to send nudge');
    }
  };

  const refreshClaims = async () => {
    setLoading(true);
    await fetchClaims();
  };

  return (
    <DashboardContext.Provider
      value={{
        claims,
        loading,
        error,
        createClaim,
        updateClaimStatus,
        sendNudge,
        refreshClaims
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};