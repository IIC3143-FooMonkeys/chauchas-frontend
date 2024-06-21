import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import { Nav } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react'

function NavBar () {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()

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
