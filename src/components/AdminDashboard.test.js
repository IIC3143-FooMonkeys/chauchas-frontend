import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';
import { useAuth0 } from '@auth0/auth0-react';

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn(),
}));

describe('AdminDashboard Component', () => {
  // Mock de useAuth0
  const mockUseAuth0 = {
    user: { sub: 'auth0|668b14ecf00760bd05d37207' }, // Mock de usuario autenticado
    isAuthenticated: true,
    isLoading: false,
  };

  beforeEach(() => {
    useAuth0.mockReturnValue(mockUseAuth0);
  });

  test('Renderización del dashboard de administrador', async () => {
    // Mock de funciones fetch para simular respuestas
    global.fetch = jest.fn();

    // Mock de datos de descuentos y usuarios
    const mockDiscounts = [
      { id: 1, local: 'Local 1', discount: 20, expiration: '2024-12-31' },
      { id: 2, local: 'Local 2', discount: 30, expiration: '2025-06-30' },
    ];

    const mockUsers = [
      { auth0Id: 'auth0|user1', cards: [{ id: 1, bankId: 'bank1', cardType: 'Gold', bankName: 'Bank 1', paymentMethod: 'Credit' }] },
      { auth0Id: 'auth0|user2', cards: [{ id: 2, bankId: 'bank2', cardType: 'Silver', bankName: 'Bank 2', paymentMethod: 'Debit' }] },
    ];

    // Mockear las respuestas de las llamadas fetch
    global.fetch
    .mockResolvedValueOnce({
      json: () => Promise.resolve({ userType: 1 }),
    })
    .mockResolvedValueOnce({
      json: () => Promise.resolve(mockDiscounts),
    })
    .mockResolvedValueOnce({
      json: () => Promise.resolve(mockUsers),
    });

    // Ya no es necesario envolver esto en act
    await render(<AdminDashboard />);

    // Esperar a que se carguen los datos de descuentos y usuarios
    await waitFor(() => {
    // Verificar que se muestre el título del dashboard
    expect(screen.getByText('Dashboard de Administrador')).toBeInTheDocument();
    });
    await waitFor(() => {
    // Verificar que se muestre el título del dashboard
    expect(screen.getByText('Total de descuentos: 2')).toBeInTheDocument();
    });
    await waitFor(() => {
    // Verificar que se muestre el título del dashboard
    expect(screen.getByText('Total de usuarios: 2')).toBeInTheDocument();
    });

    // Verificar que se muestren los elementos de la lista de descuentos
    expect(screen.getByText('Local 1')).toBeInTheDocument();
    expect(screen.getByText('Local 2')).toBeInTheDocument();

    // Verificar que se muestren los elementos de la lista de usuarios
    expect(screen.getByText('auth0|user1')).toBeInTheDocument();
    expect(screen.getByText('auth0|user2')).toBeInTheDocument();
  });

  /*

  test('Eliminar descuento', async () => {
    global.fetch = jest.fn();

    // Mock de datos de descuentos
    const mockDiscounts = [
      { id: 1, local: 'Local 1', discount: 20, expiration: '2024-12-31' },
      { id: 2, local: 'Local 2', discount: 30, expiration: '2025-06-30' },
    ];

    global.fetch
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockDiscounts) })
      .mockResolvedValueOnce({});

    render(<AdminDashboard />);

    // Esperar a que se carguen los datos de descuentos
    await waitFor(() => {
      expect(screen.getByText('Total de descuentos: 2')).toBeInTheDocument();
    });

    // Simular click en el botón Eliminar de un descuento
    fireEvent.click(screen.getByText('Eliminar', { selector: 'button' }));

    // Verificar que se elimine correctamente el descuento
    await waitFor(() => {
      expect(screen.queryByText('Local 1')).not.toBeInTheDocument();
    });
  });

  */

  /*
  test('Editar descuento', async () => {
    global.fetch = jest.fn();

    // Mock de datos de descuentos
    const mockDiscounts = [
      { id: 1, local: 'Local 1', discount: 20, expiration: '2024-12-31' },
      { id: 2, local: 'Local 2', discount: 30, expiration: '2025-06-30' },
    ];

    global.fetch
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockDiscounts) })
      .mockResolvedValueOnce({ json: () => Promise.resolve({ id: 1, local: 'Local 1 Modificado', discount: 25, expiration: '2024-12-31' }) });

    render(<AdminDashboard />);

    // Esperar a que se carguen los datos de descuentos
    await waitFor(() => {
      expect(screen.getByText('Total de descuentos: 2')).toBeInTheDocument();
    });

    // Simular click en el botón Editar de un descuento
    fireEvent.click(screen.getByText('Editar', { selector: 'button' }));

    // Verificar que se abra el modal de edición
    expect(screen.getByText('Editar Descuento')).toBeInTheDocument();

    // Modificar los datos y guardar cambios
    fireEvent.change(screen.getByLabelText('Local'), { target: { value: 'Local 1 Modificado' } });
    fireEvent.change(screen.getByLabelText('Descuento'), { target: { value: '25' } });
    fireEvent.click(screen.getByText('Guardar Cambios'));

    // Esperar a que se actualice el descuento modificado
    await waitFor(() => {
      expect(screen.getByText('Local 1 Modificado')).toBeInTheDocument();
    });
  });
  */

});
