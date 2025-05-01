import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { AuthContext } from '../context/AuthContext'

const useLogout = () => {
  const { setIsAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    // Remove token and user from cookies
    Cookies.remove('token')
    Cookies.remove('user')

    // Update authentication state
    setIsAuthenticated(false)

    // Redirect to login page
    navigate('/login', { replace: true })
  }

  return handleLogout
}

export default useLogout
