import React from 'react';
import { render, screen } from '@testing-library/react';
import { Auth0Provider } from '@auth0/auth0-react';
import Home from './Home';

const mockAuth0 = {
  isAuthenticated: false,
  loginWithRedirect: jest.fn(),
  user: null,
};

const renderWithAuth0 = (ui, { auth0 = mockAuth0, ...options } = {}) => {
  return render(
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    >
      {ui}
    </Auth0Provider>,
    options
  );
};

describe('Home Component', () => {
  test('renders without crashing', () => {
    renderWithAuth0(<Home />);
    expect(screen.getByText(/Chauchas/i)).toBeInTheDocument();
  });

  test('renders login button when not authenticated', () => {
    renderWithAuth0(<Home />);
    expect(screen.getByText(/Inicia Sesión/i)).toBeInTheDocument();
  });

  test('renders benefits button when authenticated', () => {
    renderWithAuth0(<Home />, {
      auth0: { ...mockAuth0, isAuthenticated: true },
    });
    expect(screen.getByText(/Beneficios/i)).toBeInTheDocument();
  });
});
