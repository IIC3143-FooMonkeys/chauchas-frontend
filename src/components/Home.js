import { useAuth0 } from '@auth0/auth0-react';
import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

const Home = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const [discounts, setDiscounts] = useState([]);
  const [banks, setBanks] = useState([]);
  const [cardTypes, setCardTypes] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [filter, setFilter] = useState({
    cardType: '',
    paymentType: '',
    bankName: '',
  });

  useEffect(() => {
    fetchDiscounts();
    fetchBanks();
    fetchCardType();
    fetchPaymentMethod();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch('https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/discounts');
      const data = await response.json();
      setDiscounts(data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await fetch('https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/banks');
      const data = await response.json();
      setBanks(data);
      if (data.length > 0) {
        setFilter((prev) => ({ ...prev, bankName: data[0].name }));
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };

  const fetchCardType = async () => {
    try {
      const response = await fetch('https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/cardType');
      const data = await response.json();
      setCardTypes(data);
      if (data.length > 0) {
        setFilter((prev) => ({ ...prev, cardType: data[0] }));
      }
    } catch (error) {
      console.error('Error fetching cardTypes:', error);
    }
  };

  const fetchPaymentMethod = async () => {
    try {
      const response = await fetch('https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/paymentMethod');
      const data = await response.json();
      setPaymentMethods(data);
      if (data.length > 0) {
        setFilter((prev) => ({ ...prev, paymentMethod: data[0] }));
      }
    } catch (error) {
      console.error('Error fetching paymentMethods:', error);
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
                <Form.Select
                  name="bankName"
                  value={filter.bankName}
                  onChange={handleFilterChange}
                >
                  <option value="">Selecciona un banco</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.name}>{bank.name}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Form.Select
                  name="cardType"
                  value={filter.cardType}
                  onChange={handleFilterChange}
                >
                  <option value="">Selecciona un tipo de tarjeta</option>
                  {cardTypes.map((cardType) => (
                    <option key={cardType} value={cardType}>{cardType}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Form.Select
                  name="paymentMethod"
                  value={filter.paymentMethod}
                  onChange={handleFilterChange}
                >
                  <option value="">Selecciona un tipo de pago</option>
                  {paymentMethods.map((paymentMethod) => (
                    <option key={paymentMethod} value={paymentMethod}>{paymentMethod}</option>
                  ))}
                </Form.Select>
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
