import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
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
          <Navbar.Brand href='/flights'>Chauchas</Navbar.Brand>
        )}
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <div className='ms-auto d-flex align-items-end'>
            {!isAuthenticated && (
              <>
                <NavDropdown title='Options' id='basic-nav-dropdown'>
                  <NavDropdown.Item onClick={() => loginWithRedirect()}>Login</NavDropdown.Item>
                  <NavDropdown.Divider />
                </NavDropdown>
              </>
            )}
            {isAuthenticated && (
              <>
                <NavDropdown title='Options' id='basic-nav-dropdown'>
                  <NavDropdown.Item as={Link} to='/profile'>Profile</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => logout()}> Logout </NavDropdown.Item>
                  <NavDropdown.Divider />
                </NavDropdown>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
