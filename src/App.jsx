import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Tours from './pages/Tours'
import BookedManager from './pages/ToursBooked'
import Vouchers from './pages/Vouchers'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import AdminLayout from './components/AdminLayout'
import NotFoundPage from './pages/NotFoundPage'

function App() {
    return (
        <Router>
            <Routes>
                {/* Public route: login */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                {/* Protected layout with nested routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="vouchers" element={<Vouchers />} />
                    <Route path="Tours" element={<Tours />} />
                    <Route path="/tours-booked" element={<BookedManager />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    )
}

export default App
