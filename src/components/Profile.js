import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import '../css/Profile.css'
const Profile = () => {
  const { user, isAuthenticated } = useAuth0()

  return (
    <div className='profile-container'>
      {!isAuthenticated && (
        <h2>You are not logged in</h2>
      )}
      {isAuthenticated && (
        <div className='profile-info'>
          <div className='user-info-container'>
            <h2>My information</h2>
            <div className='user-info'>
              <h2 className='user-nickname'>{user.nickname}</h2>
              {user.picture && (
                <img src={user.picture} alt={user.name} className='user-picture' />
              )}
              <div className='user-data'>
                <p>{user.name}</p>
                <p>{user.email}</p>
              </div>
            </div>
          </div>
        </div>)}
      <div className='clear' />
    </div>
  )
}

export default Profile
