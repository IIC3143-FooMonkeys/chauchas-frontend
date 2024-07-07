import { useAuth0 } from '@auth0/auth0-react';
import { Container, Row, Col, Button, Card, Form, Modal } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();

  const [discounts, setDiscounts] = useState([]);
  const [userDiscounts, setUserDiscounts] = useState([]);
  const [banks, setBanks] = useState([]);
  const [cardTypes, setCardTypes] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showUserDiscounts, setShowUserDiscounts] = useState(false);
  const [filter, setFilter] = useState({
    cardType: '',
    paymentMethod: '',
    bankName: '',
  });
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchDiscounts();
    fetchBanks();
    fetchCardType();
    fetchPaymentMethod();
  }, []);

  useEffect(() => {
    if (showUserDiscounts) {
      fetchUserDiscounts();
    }
  }, [showUserDiscounts]);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch('https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/discounts');
      const data = await response.json();
      setDiscounts(data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  const fetchUserDiscounts = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const userId = user.sub;
      const userIdParts = userId.split('|');
      const userIdClean = userIdParts.length > 1 ? userIdParts[1] : userIdParts[0];
      const response = await fetch(`https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/users/${userIdClean}/discounts`);
      const data = await response.json();
      setUserDiscounts(data);
    } catch (error) {
      console.error('Error fetching user discounts:', error);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await fetch('https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/banks');
      const data = await response.json();
      setBanks(data);
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };

  const fetchCardType = async () => {
    try {
      const response = await fetch('https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/cardType');
      const data = await response.json();
      setCardTypes(data);
    } catch (error) {
      console.error('Error fetching cardTypes:', error);
    }
  };

  const fetchPaymentMethod = async () => {
    try {
      const response = await fetch('https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/paymentMethod');
      const data = await response.json();
      setPaymentMethods(data);
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
  const handleCheckboxChange = (e) => {
    setShowUserDiscounts(e.target.checked);
  };

  const filteredDiscounts = showUserDiscounts ? userDiscounts : discounts.filter((discount) =>
    (filter.cardType ? discount.cardType.toLowerCase().includes(filter.cardType.toLowerCase()) : true) &&
    (filter.paymentMethod ? discount.paymentMethod.toLowerCase().includes(filter.paymentMethod.toLowerCase()) : true) &&
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

      <Container id="beneficios" className='benefits-container'>
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
              {isAuthenticated && (
                <Col>
                  <Form.Check 
                    type="checkbox"
                    label="Ver solo mis beneficios"
                    checked={showUserDiscounts}
                    onChange={handleCheckboxChange}
                  />
                </Col>
              )}
            </Row>
          </Form>
          <div style={{ margin: '20px 0' }}></div>         
          {filteredDiscounts.length > 0 ? (
            filteredDiscounts.map((discount) => (
              <Col md={3} key={discount.id} style={{ marginBottom: '20px' }}>
                <Card>
                  <Card.Header as="h5">{discount.local}</Card.Header>
                  <Card.Body>
                    <Card.Img variant="top" src={discount.imageUrl} alt="Descuento" />
                    <Card.Title>{discount.discount}% de descuento</Card.Title>
                    <Button variant="secondary" as={Link} to={`/discounts/${discount.id}`}>
                      Ver más detalles
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p>No se encontraron descuentos con estas características</p>
            </Col>
          )}
        </Row>
      </Container>
    </Container>
  );
};

export default Home;