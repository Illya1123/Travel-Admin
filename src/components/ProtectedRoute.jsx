import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isLogin)

    if (!isAuthenticated) return <Navigate to="/login" replace />
    return children
}

export default ProtectedRoute
