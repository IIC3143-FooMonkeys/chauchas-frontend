import { useAuth0 } from '@auth0/auth0-react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React, { useState, useEffect } from 'react';

const Home = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0()

  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch('https://www.bozitoapi.online/discounts');
      const data = await response.json();
      setDiscounts(data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  return (
    <Container>
    
    <Container className="d-flex vh-100 justify-content-center align-items-center">
      <Row>
        <Col>
          <img src={`${process.env.PUBLIC_URL}/4745-200.png`} alt="Descripción" />
          <h1 className="display-1"><strong>Chauchas</strong></h1>
          <p>Descubre todos los beneficios de tus tarjetas en un solo lugar</p>
          {!isAuthenticated && (
            <>
              <Button variant="secondary" onClick={() => loginWithRedirect()}>Inicia Sesión</Button>
            </>
          )}
          {isAuthenticated && (
            <>
              <Button variant="secondary" href="#beneficios">Beneficios</Button>            
            </>
          )}
        </Col>
      </Row>
    </Container>
    
    <div className="my-5 border-bottom"></div>

    <Container id="beneficios">
      <Row>
        <h1>Beneficios</h1>
        <div style={{ margin: '20px 0' }}></div>
        
        {discounts.map((discount, index) => (
            <Col md={3} key={discount.id} style={{ marginBottom: '20px' }}>
              <Card>
                <Card.Header as="h5">{discount.local}</Card.Header>
                <Card.Body>
                  <Card.Title>{discount.discount}% de descuento</Card.Title>
                  <Card.Text style={{ textAlign: 'left' }}>
                    {discount.description}<br/>
                    <strong>Válido hasta:</strong> {new Date(discount.expiration).toLocaleDateString()}<br/>
                    <strong>Días:</strong> {discount.days}<br/>
                    <strong>Tarjeta:</strong> {discount.cardType} - {discount.paymentType}<br/>
                    <strong>Banco:</strong> {discount.bankName}
                  </Card.Text>
                  <Button variant="secondary" href={discount.url}>Ver más detalles</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}

      </Row>
    </Container>

    </Container>
  )
}

export default Home
