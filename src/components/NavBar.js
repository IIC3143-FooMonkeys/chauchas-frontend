import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import { Nav } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react'
import React, { useState, useEffect} from 'react';

function NavBar () {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUser = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const userId = user.sub;
      const userIdParts = userId.split('|');
      const userIdClean = userIdParts.length > 1 ? userIdParts[1] : userIdParts[0];
      const response = await fetch(`https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/users/${userIdClean}`);
      const data = await response.json();
      if (data.userType === 1){
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Error fetching user discounts:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) { 
      fetchUser(); 
    } // eslint-disable-next-line 
  }, [isAuthenticated, user]); 

  return (
    <Navbar expand='lg' className='bg-body-tertiary'>
      <Container>
        {!isAuthenticated && (
          <Navbar.Brand href='/'>Chauchas</Navbar.Brand>
        )}
        {isAuthenticated && (
          <Navbar.Brand href='/'>Chauchas</Navbar.Brand>
        )}
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <div className='ms-auto d-flex align-items-end'>
            {!isAuthenticated && (
              <>
                <Nav.Link onClick={() => loginWithRedirect()} className="me-3">Iniciar Sesión</Nav.Link>
              </>
            )}
            {isAuthenticated && (
              <>
              {isAdmin && (
                <Nav.Link as={Link} to='/adminDashboard' className="me-3">Dashboard Administrador</Nav.Link>
              )}
                <Nav.Link as={Link} to='/profile' className="me-3">Mi Perfil</Nav.Link>
                <Nav.Link onClick={() => logout()} className="me-3">Cerrar Sesión</Nav.Link>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
