import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { useAuth0 } from '@auth0/auth0-react';
import '../css/Profile.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  const [show, setShow] = useState(false);
  const [userCards, setUserCards] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const userId = user.sub;
  const userIdParts = userId.split('|');
  const userIdClean = userIdParts.length > 1 ? userIdParts[1] : userIdParts[0];

  const userCardsUrl = `https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/users/${userIdClean}`;
  const allCardsUrl = 'https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/cards';

  // Función para obtener las tarjetas del usuario
  const fetchCards = async () => {
    if (isAuthenticated) {
      try {
        const response = await fetch(userCardsUrl);
        const data = await response.json();
        setUserCards(data.cards);
        if (!response.ok) {
          throw new Error('No se pudo obtener una respuesta satisfactoria del servidor');
        }
      } catch (error) {
        console.error('Error', error);
      }
    }
  };

  // Obtener las tarjetas del usuario al cargar o al cambiar el estado de autenticación
  useEffect(() => {
    fetchCards();
  }, [userCardsUrl, isAuthenticated]);

  // Obtener todas las tarjetas disponibles al cargar o al cambiar el estado de autenticación
  useEffect(() => {
    const fetchAllCards = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetch(allCardsUrl);
          const data = await response.json();
          setAllCards(data);
          if (!response.ok) {
            throw new Error('No se pudo obtener una respuesta satisfactoria del servidor');
          }
        } catch (error) {
          console.error('Error', error);
        }
      }
    };

    fetchAllCards();
  }, [allCardsUrl, isAuthenticated]);

  // Agrupar todas las tarjetas por banco
  const groupedOptions = allCards.reduce((groups, card) => {
    const groupIndex = groups.findIndex(group => group.label === card.bankName);
    const option = { value: card.id, label: `${card.paymentMethod} - ${card.cardType}` };
    if (groupIndex > -1) {
      groups[groupIndex].options.push(option);
    } else {
      groups.push({ label: card.bankName, options: [option] });
    }
    return groups;
  }, []);

  // Añadir tarjeta al usuario
  const patchCard = async () => {
    try {
      const response = await fetch(`https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/users/${userIdClean}/add-card/${selectedCard}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo completar la operación');
      }

      const data = await response.json();
      console.log('Operación exitosa:', data);

      fetchCards(); // Actualizar las tarjetas del usuario
    } catch (error) {
      console.error('Error al realizar la operación:', error);
    }
  };

  // Eliminar tarjeta del usuario
  const deleteCard = async (cardId) => {
    try {
      const response = await fetch(`https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/users/${userIdClean}/delete-card/${cardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo completar la operación de eliminación');
      }

      const data = await response.json();
      console.log('Tarjeta eliminada con éxito:', data);

      fetchCards(); // Actualizar las tarjetas del usuario
    } catch (error) {
      console.error('Error al eliminar la tarjeta:', error);
    }
  };

  return (
    <div className='profile-container'>
      {!isAuthenticated && (
        <h2>No estás logueado</h2>
      )}
      {isAuthenticated && (
        <Container>
          <Row>
            <Col lg="3">
              <div className='user-info-container'>
                <div className='user-info'>
                  {user.picture && (
                    <img src={user.picture} alt={user.name} className='user-picture' />
                  )}
                  <div className='user-data'>
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col>
              <h2>Mis Tarjetas</h2>

              <Button variant="light" className="mb-3" onClick={handleShow}>
                Añadir Tarjeta
              </Button>

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Añadir Tarjeta</Modal.Title>
                </Modal.Header>

                <Form>
                  <Modal.Body>
                    <Select
                      options={groupedOptions}
                      classNamePrefix="select"
                      placeholder="Seleccionar Tarjeta"
                      formatGroupLabel={data => (
                        <div>
                          <span>{data.label}</span>
                        </div>
                      )}
                      onChange={option => setSelectedCard(option.value)}
                    />
                  </Modal.Body>
                </Form>

                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={patchCard}>
                    Añadir
                  </Button>
                </Modal.Footer>
              </Modal>

              <ListGroup>
                {userCards.map((usrCard) => (
                  <ListGroup.Item key={usrCard.id} className="d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{usrCard.bankName}</div>
                      {usrCard.cardType} - {usrCard.paymentMethod}
                    </div>
                    <Button variant="danger" onClick={() => deleteCard(usrCard.id)}>Eliminar</Button>{' '}
                  </ListGroup.Item>
                ))}
              </ListGroup>

            </Col>
          </Row>
        </Container>
      )}
      <div className='clear' />
    </div>
  )
}

export default Profile;
