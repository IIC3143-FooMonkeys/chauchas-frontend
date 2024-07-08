import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Discount from './Discount';
import fetchMock from 'jest-fetch-mock';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    discountId: 'exampleDiscountId'
  })
}));

describe('Discount Component', () => {
  test('Renderización con datos mock', async () => {
    // Datos mock del descuento
    const mockDiscount = {
      id: '668b1623d71c854abae64762',
      url: 'http://www.adams.com/',
      imageUrl: 'https://picsum.photos/1000/1000',
      local: 'Robinson-Castaneda',
      discount: 30,
      description: 'Store particular live dog much style. Bill sort a billion maintain. However miss between edge relationship.',
      expiration: '2026-07-21',
      days: 'Todos los días',
      cardType: 'Bronze',
      paymentMethod: 'Debito',
      bankName: 'Banco de Chile'
    };

    fetchMock.enableMocks();
    fetchMock.mockResponseOnce(JSON.stringify(mockDiscount));

    render(
      <Router>
        <Discount />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Robinson-Castaneda')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByAltText('Descuento')).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.queryByText(/Bronze/i);
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.queryByText(/Debito/i); 
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.queryByText(/Banco de Chile/i);
      expect(element).toBeInTheDocument();
    });

    await waitFor(() => {
      const element = screen.queryByText(/Todos los días/i);
      expect(element).toBeInTheDocument();
    });
  });
});


