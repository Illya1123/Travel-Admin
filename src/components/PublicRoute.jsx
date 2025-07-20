import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isLogin)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PublicRoute
