// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// API Request Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: string | number | boolean | null | undefined;
}

export type QueryParams = PaginationParams & SortParams & FilterParams;

// User Profile Types
export interface UserProfile {
  id: string;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  website: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UpdateUserProfileRequest {
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  website?: string;
}

// Feature Flag Types
export interface FeatureFlag {
  id: number;
  name: string;
  description: string | null;
  enabled: boolean;
  createdAt: string;
}

// Auth Types
export interface SignUpRequest {
  email: string;
  password: string;
  username?: string;
  fullName?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  password: string;
}