import { useAuth0 } from '@auth0/auth0-react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Home = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0()

  return (
    <Container>
    <Container className="d-flex vh-100 justify-content-center align-items-center">
      <Row>
        <Col className="text-center">
          <h1 className="display-1">Chauchas</h1>
          <p> </p>
        </Col>
      </Row>
    </Container>
      
    <Container>
      <Row>
        <div className='Home-content'>
          {!isAuthenticated && (
            <>
              <h1 className='Home-title'>Bienvenido a Chauchas!</h1>
              <button className='Home-button' onClick={() => loginWithRedirect()}>Login</button>
            </>
          )}
          {isAuthenticated && (
            <div>
              <h1 className='Home-title'>Welcome {user.name}!</h1>
            </div>
          )}

        </div>
      </Row>
    </Container>
    </Container>
  )
}

export default Home
