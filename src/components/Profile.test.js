// Profile.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Profile from './Profile';
import { useAuth0 } from '@auth0/auth0-react';

// Mockear useAuth0
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn(),
}));

const mockUser = {
  sub: 'auth0|123456',
  picture: 'https://example.com/picture.jpg',
  name: 'Test User',
  email: 'test@example.com',
};

const mockFetch = (url) => {
  if (url.includes('users')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ cards: [{ id: '1', bankName: 'Bank A', cardType: 'Credit', paymentMethod: 'Visa' }] }),
    });
  } else if (url.includes('cards')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: '2', bankName: 'Bank B', cardType: 'Debit', paymentMethod: 'MasterCard' }]),
    });
  }
  return Promise.reject(new Error('not found'));
};

global.fetch = jest.fn().mockImplementation((url) => mockFetch(url));

describe('Profile Component', () => {
  beforeEach(() => {
    useAuth0.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    });
  });

  test('renders profile information', () => {
    render(<Profile />);

    expect(screen.getByText(/test user/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    expect(screen.getByAltText(/test user/i)).toBeInTheDocument();
  });

  test('renders user cards', async () => {
    render(<Profile />);
  
    await screen.findByText(/Bank A/i, {}, { timeout: 5000 });
    await screen.findByText(/Credit - Visa/i);
  });

  test('shows message when not authenticated', () => {
    useAuth0.mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    render(<Profile />);

    expect(screen.getByText(/no estás logueado/i)).toBeInTheDocument();
  });
});
