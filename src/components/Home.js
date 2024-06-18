import { useAuth0 } from '@auth0/auth0-react'

const Home = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0()

  return (
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
          <h2 className='Home-title'>Pulsa para acceder a los descuentos</h2>
          <h2 className='Home-title'>cfvalidation test</h2>
        </div>
      )}
    </div>
  )
}

export default Home
