import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import Home from '../components/Home';
import fetchMock from 'jest-fetch-mock';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('@auth0/auth0-react');

fetchMock.enableMocks();

describe('Home Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders the login button when not authenticated', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: jest.fn(),
    });

    render(
      <Router>
        <Home />
      </Router>
    );

    expect(screen.getByText('Inicia Sesión')).toBeTruthy();
  });

  it('renders the benefits button when authenticated', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { sub: 'auth0|123' },
    });

    fetchMock.mockResponseOnce(JSON.stringify([]));

    render(
      <Router>
        <Home />
      </Router>
    );

    await waitFor(() => {
      const buttons = screen.getAllByText('Beneficios');
      expect(buttons[0]).toBeTruthy();
    });
  });

  it('fetches and displays discounts', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { sub: 'auth0|123' },
    });

    const mockDiscounts = [
      { id: '1', local: 'Store A', discount: 10, imageUrl: 'https://example.com/image1.jpg', cardType: 'Débito', paymentMethod: 'Visa', bankName: 'Bank A' },
      { id: '2', local: 'Store B', discount: 20, imageUrl: 'https://example.com/image2.jpg', cardType: 'Crédito', paymentMethod: 'Mastercard', bankName: 'Bank B' },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockDiscounts));

    render(
      <Router>
        <Home />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Store A')).toBeTruthy();
    });

    await waitFor(() => {
      expect(screen.getByText('Store B')).toBeTruthy();
    });
  });
});