import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import LoginForm from '../../forms/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase';

// Mock the modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/supabase', () => ({
  getSupabaseClient: jest.fn(),
}));

describe('LoginForm Component', () => {
  // Setup mocks before each test
  beforeEach(() => {
    // Router mock
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Auth context mock
    (useAuth as jest.Mock).mockReturnValue({
      refreshAuth: jest.fn().mockResolvedValue(undefined),
    });

    // Supabase client mock
    const mockSignInWithPassword = jest.fn().mockResolvedValue({ error: null });
    const mockSignInWithOAuth = jest.fn().mockResolvedValue({ error: null });
    
    (getSupabaseClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
        signInWithOAuth: mockSignInWithOAuth,
      },
    });

    // Reset window.location.origin for Google OAuth test
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost:3000' },
      writable: true,
    });
  });

  // Restore console.error if it was mocked
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the login form correctly', () => {
    render(<LoginForm />);

    // Check for heading
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    
    // Check for form inputs
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    
    // Check for links
    expect(screen.getByText('create a new account')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
  });

  it('submits the form with email and password', async () => {
    render(<LoginForm />);
    const user = userEvent.setup();
    
    // Fill out form
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check if sign in was called
    await waitFor(() => {
      expect(getSupabaseClient().auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    // Check if redirect happened
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message when login fails', async () => {
    // Mock console.error to prevent it from appearing in test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock a failed login attempt
    (getSupabaseClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue({ 
          error: { message: 'Invalid login credentials' } 
        }),
        signInWithOAuth: jest.fn(),
      },
    });
    
    render(<LoginForm />);
    const user = userEvent.setup();
    
    // Fill out form
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpassword');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('calls Google OAuth when Google button is clicked', async () => {
    render(<LoginForm />);
    const user = userEvent.setup();
    
    // Click Google button
    await user.click(screen.getByRole('button', { name: /google/i }));
    
    // Check if OAuth was called
    await waitFor(() => {
      expect(getSupabaseClient().auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/api/auth/callback',
        },
      });
    });
  });
});