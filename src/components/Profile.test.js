import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Profile from './Profile';
import fetchMock from 'jest-fetch-mock'; // Importa jest-fetch-mock

jest.mock('@auth0/auth0-react');

describe('Profile Component', () => {
  beforeEach(() => {
    useAuth0.mockReturnValue({
      user: {
        sub: 'auth0|1234567890',
        name: 'John Doe',
        email: 'john.doe@example.com',
        picture: 'https://example.com/john-doe.jpg',
      },
      isAuthenticated: true,
    });
  });

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // **** MOSTRAR USUARIO **** //

  test('Mostrar Datos de Usuario Logueado', () => {
    render(<Profile />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByAltText('John Doe')).toBeInTheDocument();
  });

  // **** MOSTRAR TARJETA **** //

  test('Mostrar Tarjetas del Usuario', async () => {
    const mockUserCards = [
      { id: 'card1', bankName: 'Banco A', cardType: 'Débito', paymentMethod: 'Visa' },
      { id: 'card2', bankName: 'Banco B', cardType: 'Crédito', paymentMethod: 'Mastercard' },
    ];

    const mockAllCards = [
      { id: 'card1', bankName: 'Banco A', cardType: 'Débito', paymentMethod: 'Visa' },
      { id: 'card2', bankName: 'Banco B', cardType: 'Crédito', paymentMethod: 'Mastercard' },
      { id: 'card3', bankName: 'Banco C', cardType: 'Crédito', paymentMethod: 'Visa' },
    ];

    fetchMock.mockResponseOnce(JSON.stringify({ cards: mockUserCards }));
    fetchMock.mockResponseOnce(JSON.stringify(mockAllCards));

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Banco A')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Débito - Visa')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Banco B')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Crédito - Mastercard')).toBeInTheDocument();
    });
  });

  // **** AÑADIR TARJETA **** //

  test('Añadir Tarjeta al Usuario', async () => {
    const mockUserCards = [
      { id: 'card1', bankName: 'Banco A', cardType: 'Débito', paymentMethod: 'Visa' },
    ];

    const mockAllCards = [
      { id: 'card1', bankName: 'Banco A', cardType: 'Débito', paymentMethod: 'Visa' },
      { id: 'card2', bankName: 'Banco B', cardType: 'Crédito', paymentMethod: 'Mastercard' },
    ];

    fetchMock.mockResponseOnce(JSON.stringify({ cards: mockUserCards }));
    fetchMock.mockResponseOnce(JSON.stringify(mockAllCards));

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Banco A')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Añadir Tarjeta'));

    // modal
    await waitFor(() => {
      const elements = screen.getAllByText('Añadir Tarjeta');
      expect(elements.length).toBeGreaterThan(0); // Verifica que al menos hay un elemento con el texto dado
      // Puedes verificar cada elemento si lo necesitas:
      elements.forEach(element => {
        expect(element).toBeInTheDocument();
      });
    });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'card2' } });

    fireEvent.click(screen.getByText('Añadir'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(3); // Verifica que se hizo una llamada para añadir la tarjeta
    });

    await waitFor(() => {
      expect(screen.getByText('Banco B')).toBeInTheDocument(); // Verifica que la tarjeta añadida está en la lista
    });

  });

  // **** ELIMINAR TARJETA **** //

  /*
  test('Eliminar Tarjeta del Usuario', async () => {
    const mockUserCards = [
      { id: 'card1', bankName: 'Banco A', cardType: 'Débito', paymentMethod: 'Visa' }
    ];
  
    const mockAllCards = [];
  
    fetchMock.mockResponseOnce(JSON.stringify({ cards: mockUserCards }));
    fetchMock.mockResponseOnce(JSON.stringify(mockAllCards));
  
    render(<Profile />);
  
    // Esperar a que se carguen las tarjetas del usuario
    await waitFor(() => {
      expect(screen.getByText('Banco A')).toBeInTheDocument();
    });
  
    // Simular clic en el botón de eliminar dentro de "Banco A"
    const deleteButton = screen.getByText('Eliminar');
    fireEvent.click(deleteButton);
  
    // Esperar a que se complete la eliminación y la actualización de la interfaz
    await waitFor(() => {
      expect(screen.queryByText('Banco A')).not.toBeInTheDocument();
    }, { timeout: 10000 }); // Ajustar el timeout según la velocidad de tu aplicación y la respuesta del servidor
  });
  */
  


});


