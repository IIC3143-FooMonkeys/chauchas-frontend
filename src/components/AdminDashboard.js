import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';

const AdminDashboard = () => {
  const { user, isLoading } = useAuth0();
  const [discounts, setDiscounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [userType, setUserType] = useState(null);
  const [userIdClean, setUserIdClean] = useState('');

  useEffect(() => {
    if (user) {
      const userId = user.sub;
      const userIdParts = userId.split('|');
      const userIdCleanTemp = userIdParts.length > 1 ? userIdParts[1] : userIdParts[0];
      setUserIdClean(userIdCleanTemp);
      fetchUserType(userIdCleanTemp);
    }
  }, [user]);

  const fetchUserType = async (userIdClean) => {
    try {
      const response = await fetch(`https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/users/${userIdClean}`);
      const data = await response.json();
      setUserType(data.userType);
    } catch (error) {
      console.error('Error fetching user type:', error);
    }
  };

  useEffect(() => {
    if (userType === 1) {
      fetchDiscounts();
      fetchUsers();
    }
  }, [userType]);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch('https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/discounts');
      const data = await response.json();
      setDiscounts(data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteDiscount = async (id) => {
    try {
      await fetch(`https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/discounts/${id}?userId=${userIdClean}`, {
        method: 'DELETE'
      });
      setDiscounts(discounts.filter(discount => discount.id !== id));
    } catch (error) {
      console.error('Error deleting discount:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/users/${id}?userId=${userIdClean}`, {
        method: 'DELETE'
      });
      setUsers(users.filter(user => user.auth0Id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleShowEditModal = (item) => {
    setCurrentEditItem(item);
    setEditFormData(item);
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/${currentEditItem.type}/${currentEditItem.id}?userId=${userIdClean}`, {
        method: 'PUT', // or 'PATCH'
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });
      const updatedItem = await response.json();
      if (currentEditItem.type === 'discounts') {
        setDiscounts(discounts.map(item => item.id === updatedItem.id ? updatedItem : item));
      } else if (currentEditItem.type === 'users') {
        setUsers(users.map(item => item.auth0Id === updatedItem.auth0Id ? updatedItem : item));
      }
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  if (isLoading || userType === null) {
    return <div>Loading...</div>;
  }

  if (userType !== 1) {
    return <div>Usted no es administrador</div>;
  }

  return (
    <Container className="my-5">
      <h1 className="display-4 mb-5">Dashboard de Administrador</h1>
      
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header as="h5">Resumen de Descuentos</Card.Header>
            <Card.Body>
              <Card.Title>Total de descuentos: {discounts.length}</Card.Title>
              <Button variant="primary" onClick={fetchDiscounts}>Actualizar Descuentos</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header as="h5">Resumen de Usuarios</Card.Header>
            <Card.Body>
              <Card.Title>Total de usuarios: {users.length}</Card.Title>
              <Button variant="primary" onClick={fetchUsers}>Actualizar Usuarios</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2 className="mb-3">Lista de Descuentos</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Local</th>
                <th>Descuento</th>
                <th>Expiración</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount.id}>
                  <td>{discount.id}</td>
                  <td>{discount.local}</td>
                  <td>{discount.discount}%</td>
                  <td>{new Date(discount.expiration).toLocaleDateString()}</td>
                  <td>
                    <Button variant="success" size="sm" className="me-2" onClick={() => handleShowEditModal({ ...discount, type: 'discounts' })}>Editar</Button>
                    <Button variant="danger" size="sm" onClick={() => deleteDiscount(discount.id)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h2 className="mb-3">Lista de Usuarios</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tarjetas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.auth0Id}>
                  <td>{user.auth0Id}</td>
                  <td>
                    <ul>
                      {user.cards.map((card, index) => (
                        <li key={index}>
                          ID: {card.id}, Bank ID: {card.bankId}, Type: {card.cardType}, Bank: {card.bankName}, Payment Method: {card.paymentMethod}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => deleteUser(user.auth0Id)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar {currentEditItem?.type === 'discounts' ? 'Descuento' : 'Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {currentEditItem?.type === 'discounts' ? (
              <>
                <Form.Group controlId="formLocal">
                  <Form.Label>Local</Form.Label>
                  <Form.Control type="text" name="local" value={editFormData.local || ''} onChange={handleEditChange} />
                </Form.Group>
                <Form.Group controlId="formDiscount">
                  <Form.Label>Descuento</Form.Label>
                  <Form.Control type="number" name="discount" value={editFormData.discount || ''} onChange={handleEditChange} />
                </Form.Group>
                <Form.Group controlId="formExpiration">
                  <Form.Label>Expiración</Form.Label>
                  <Form.Control type="date" name="expiration" value={new Date(editFormData.expiration).toISOString().split('T')[0]} onChange={handleEditChange} />
                </Form.Group>
              </>
            ) : (
              <>
                <Form.Group controlId="formName">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" name="name" value={editFormData.name || ''} onChange={handleEditChange} />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={editFormData.email || ''} onChange={handleEditChange} />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleEditSubmit}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
