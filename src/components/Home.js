import { useAuth0 } from '@auth0/auth0-react';
import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const Home = () => {
  const { isAuthenticated, loginWithRedirect, user , getIdTokenClaims } = useAuth0();

  const [discounts, setDiscounts] = useState([]);
  const [filter, setFilter] = useState({
    cardType: '',
    paymentType: '',
    bankName: '',
  });

  useEffect(() => {
    fetchDiscounts();
    if (isAuthenticated) {
      getIdTokenClaims().then(claims => {
        console.log('Role', claims['dev-7irjhqu7bkli7s2c.us.auth0.com']);
      });
    }
  }, [isAuthenticated, getIdTokenClaims]);

  useEffect(() => {
    // Opcionalmente, aquí podrías filtrar los descuentos directamente después de cargarlos
  }, [filter]);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch('https://www.bozitoapi.online/discounts');
      const data = await response.json();
      setDiscounts(data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredDiscounts = discounts.filter((discount) =>
    (filter.cardType ? discount.cardType.toLowerCase().includes(filter.cardType.toLowerCase()) : true) &&
    (filter.paymentType ? discount.paymentType.toLowerCase().includes(filter.paymentType.toLowerCase()) : true) &&
    (filter.bankName ? discount.bankName.toLowerCase().includes(filter.bankName.toLowerCase()) : true)
  );

  return (
    <Container>
      <Container className="d-flex vh-100 justify-content-center align-items-center">
        <Row>
          <Col>
            <img src={`${process.env.PUBLIC_URL}/4745-200.png`} alt="Descripción" />
            <h1 className="display-1"><strong>Chauchas</strong></h1>
            <p>Descubre todos los beneficios de tus tarjetas en un solo lugar</p>
            {!isAuthenticated && (
              <Button variant="secondary" onClick={() => loginWithRedirect()}>Inicia Sesión</Button>
            )}
            {isAuthenticated && user.role === 'admin' && (
              <Link to="/admin">
                <Button variant="secondary">Dashboard de Administrador</Button>
              </Link>
            )}
            {isAuthenticated && (
              <Button variant="secondary" href="#beneficios">Beneficios</Button>
            )}
          </Col>
        </Row>
      </Container>

      <div className="my-5 border-bottom"></div>

      <Container id="beneficios">
        <Row>
          <h1>Beneficios</h1>
          <Form>
            <Row>
              Filtros:
              <Col>
              <Form.Control
                type="text"
                name="bankName"
                value={filter.bankName}
                onChange={handleFilterChange}
                placeholder="Banco"
              />
              </Col>
              <Col>
              <Form.Control
                type="text"
                name="cardType"
                value={filter.cardType}
                onChange={handleFilterChange}
                placeholder="Tipo de Tarjeta"
              />
              </Col>
              <Col>
              <Form.Control
                type="text"
                name="paymentType"
                value={filter.paymentType}
                onChange={handleFilterChange}
                placeholder="Tipo de Pago"
              />
              </Col>
            </Row>
          </Form>
          <div style={{ margin: '20px 0' }}></div>
          
          {filteredDiscounts.map((discount) => (
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
  );
};

export default Home;
