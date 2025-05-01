import { render, screen } from '@testing-library/react';
import HomePage from '../page';

describe('HomePage', () => {
  it('renders the homepage correctly', () => {
    render(<HomePage />);
    
    // Check if main heading exists
    expect(screen.getByText('Welcome to SupaNext Template')).toBeInTheDocument();
    
    // Check for sub-heading
    expect(screen.getByText('A modern template using Next.js and Supabase.')).toBeInTheDocument();
  });
});