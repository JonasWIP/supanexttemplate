// Edge Function Response Types
export interface EdgeResponse<T> {
  data?: T;
  error?: EdgeError;
}

export interface EdgeError {
  code: string;
  message: string;
  details?: unknown;
}

// Hello World Edge Function Types
export interface HelloWorldRequest {
  name?: string;
}

export interface HelloWorldResponse {
  message: string;
  timestamp: number;
}

// User Profile Edge Function Types
export interface GetUserProfileRequest {
  userId: string;
}

export interface GetUserProfileResponse {
  id: string;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  website: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UpdateUserProfileRequest {
  userId: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  website?: string;
}

// Feature Flag Edge Function Types
export interface GetFeatureFlagRequest {
  name: string;
}

export interface GetFeatureFlagResponse {
  name: string;
  enabled: boolean;
  description?: string;
}

// Helper function to call edge functions with proper typing
export async function callEdgeFunction<TRequest, TResponse>(
  functionName: string,
  payload?: TRequest
): Promise<EdgeResponse<TResponse>> {
  try {
    const response = await fetch(`/api/edge/${functionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: {
          code: 'edge_function_error',
          message: `Edge function '${functionName}' failed`,
          details: errorData,
        },
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: {
        code: 'network_error',
        message: `Failed to call edge function '${functionName}'`,
        details: error,
      },
    };
  }
}