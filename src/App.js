import './css/App.css'
import NavBar from './components/NavBar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Profile from './components/Profile'
import AdminDashboard from './components/AdminDashboard'

function App () {
  return (
    <Router>
      <div className='App'>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/adminDashboard' element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
