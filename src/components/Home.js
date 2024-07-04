import { useAuth0 } from '@auth0/auth0-react';
import { Container, Row, Col, Button, Card, Form, Modal } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

const Home = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const [discounts, setDiscounts] = useState([]);
  const [filter, setFilter] = useState({
    cardType: '',
    paymentType: '',
    bankName: '',
  });
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  useEffect(() => {
    // Opcionalmente, aquí podrías filtrar los descuentos directamente después de cargarlos
  }, [filter]);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch('https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/discounts');
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

  const handleShowDetailsModal = (discount) => {
    setSelectedDiscount(discount);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedDiscount(null);
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

          <Row>
            {filteredDiscounts.map((discount) => (
              <Col md={3} key={discount.id} style={{ marginBottom: '20px' }}>
                <Card>
                  <Card.Header as="h5">{discount.local}</Card.Header>
                  <Card.Body>
                    <Card.Title>{discount.discount}% de descuento</Card.Title>
                    <Card.Text style={{ textAlign: 'center' }}>{discount.bankName}<br/></Card.Text>
                    <Button variant="secondary" onClick={() => handleShowDetailsModal(discount)}>Ver más detalles</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Row>
      </Container>

      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Descuento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDiscount && (
            <>
              <p>{selectedDiscount.description}</p>
              <p><strong>Válido hasta:</strong> {new Date(selectedDiscount.expiration).toLocaleDateString()}</p>
              <p><strong>Días:</strong> {selectedDiscount.days}</p>
              <p><strong>Tarjeta:</strong> {selectedDiscount.cardType} - {selectedDiscount.paymentType}</p>
              <p><strong>Banco:</strong> {selectedDiscount.bankName}</p>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Home;