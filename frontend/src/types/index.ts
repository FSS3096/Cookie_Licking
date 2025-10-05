export interface User {
  id: string;
  email: string;
  name: string;
  role: 'contributor' | 'maintainer';
  githubUsername?: string;
  profilePicture?: string;
  createdAt: string;
}

export interface Claim {
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

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  error?: any;
}